// controllers/income.controller.js
const Income = require("./model/income.model");

const addIncome = async (req, res) => {
  try {
    const { userId, description, amount, status } = req.body;

    const newIncome = new Income({
      userId,
      description,
      amount,
      status,
      timestamp: new Date(),
    });

    await newIncome.save();

    res.status(200).json({ message: "Income added successfully" });
  } catch (error) {
    console.error("Error adding Income", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getIncomes = async (req, res) => {
  try {
    const userId = req.query.userId; // Change from req.body to req.query
    const incomes = await Income.find({ userId });
    res.status(200).json(incomes);
  } catch (error) {
    console.error("Error fetching Incomes", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateIncome = async (req, res) => {
  try {
    const incomeId = req.params.incomeId;
    const { description, amount, status } = req.body;
    if (!description || !amount) {
      return res
        .status(400)
        .json({ error: "Description and amount are required." });
    }

    const updateIncome = await Income.findByIdAndUpdate(
      incomeId,
      { description, amount, status },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Income updated successfully", updateIncome });
  } catch (error) {
    console.error("Error updating Income", error);
  }
};

const deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    await Income.findByIdAndDelete(incomeId);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting Income", error);
  }
};

module.exports = { addIncome, getIncomes, updateIncome, deleteIncome };
