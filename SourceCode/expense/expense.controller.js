const Expense = require("./model/expense.model");

const addExpenses = async (req, res) => {
  try {
    // Extracting data from the request body
    const { description, amount } = req.body;

    // Checking if required fields are provided
    if (!description || !amount) {
      return res
        .status(400)
        .json({ error: "Description and amount are required." });
    }

    // Creating a new Expense instance
    const newExpense = new Expense({
      description,
      amount,
      // Other fields if any...
    });

    // Saving the new expense to the database
    await newExpense.save();

    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error("Error adding Expense", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getExpenses = async (req, res) => {
  try {
    // Fetching all expenses from the database
    const expenses = await Expense.find();

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching Expenses", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getExpenses, addExpenses };
