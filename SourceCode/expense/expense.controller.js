const cron = require("node-cron");
const cronstrue = require("cronstrue");
const Expense = require("./model/expense.model");
const nodemailer = require("nodemailer");

const addExpenses = async (req, res) => {
  try {
    const { userId, description, amount, status } = req.body;

    const newExpense = new Expense({
      userId,
      description,
      amount,
      status,
      timestamp: new Date(),
    });

    await newExpense.save();

    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error("Error adding Expense", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.query.userId;
    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching Expenses", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    await Expense.findByIdAndDelete(expenseId);

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting Expense", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const { description, amount, status } = req.body;

    if (!description || !amount) {
      return res
        .status(400)
        .json({ error: "Description and amount are required." });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { description, amount, status },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    console.error("Error updating Expense", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const setReminder = async (req, res) => {
  try {
    const { title, userEmail, reminderDate } = req.body;
    const timestamp = new Date(reminderDate);

    // Get the cron expression for the reminderDate
    const cronExpression = `0 ${timestamp.getMinutes()} ${timestamp.getHours()} ${timestamp.getDate()} ${
      timestamp.getMonth() + 1
    } *`;

    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 587,
      secure: false,
      auth: {
        user: "vraj1763@gmail.com",
        pass: "Vraj2003@",
      },
    });

    cron.schedule(cronExpression, async () => {
      const mailOptions = {
        from: "vraj1763@gmail.com",
        to: "vrajchess@gmail.com",
        subject: "Test Email",
        text: "This is a test email.",
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    });

    res.status(200).send("Reminder scheduled successfully");
  } catch (error) {
    console.error("Error scheduling Reminder", error);
    res.status(500).send("Error scheduling reminder");
  }
};

module.exports = {
  getExpenses,
  addExpenses,
  deleteExpense,
  updateExpense,
  setReminder,
};
