const Expense = require("./model/expense.model");

const addExpenses = async (req, res) => {
  try {
    const { userId, description, amount } = req.body;
    if (!userId || !description || !amount) {
      return res
        .status(400)
        .json({ error: "Description and amount are required." });
    }

    const newExpense = new Expense({
      userId,
      description,
      amount,
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
    const { description, amount } = req.body;

    if (!description || !amount) {
      return res
        .status(400)
        .json({ error: "Description and amount are required." });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { description, amount },
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

module.exports = { getExpenses, addExpenses, deleteExpense, updateExpense };
