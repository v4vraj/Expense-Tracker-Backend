const Expense = require("./model/expense.model");

const addExpenses = async (req, res) => {
  try {
    const { userId, description, amount, status } = req.body;
    console.log(userId, description, amount, status);

    const newExpense = new Expense({
      userId,
      description,
      amount,
      status,
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
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 3;
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const filterStatus = req.query.filterStatus || ""; // Change here
    const skip = (page - 1) * itemsPerPage;
    console.log(filterStatus);
    // Define the filter based on filterStatus
    const filter = filterStatus
      ? { userId, status: filterStatus } // Change here
      : { userId };

    const totalExpenses = await Expense.countDocuments(filter);
    const totalPages = Math.ceil(totalExpenses / itemsPerPage);

    const expenses = await Expense.find(filter)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ description: sortOrder });

    res.status(200).json({ expenses, totalPages });
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
