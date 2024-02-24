// controllers/monthlyBudget.controller.js
const MonthlyBudget = require("./model/monthlyBudget.model");

const addMonthlyBudget = async (req, res) => {
  try {
    const { month, year, budgetAmount, expenses } = req.body;

    const newMonthlyBudget = new MonthlyBudget({
      month,
      year,
      budgetAmount,
      expenses,
    });
    console.log(newMonthlyBudget);
    await newMonthlyBudget.save();

    res.status(200).json({ message: "MonthlyBudget added successfully" });
  } catch (error) {
    console.error("Error adding MonthlyBudget", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMonthlyBudgets = async (req, res) => {
  try {
    const monthlyBudgets = await MonthlyBudget.find();
    res.status(200).json(monthlyBudgets);
  } catch (error) {
    console.error("Error fetching MonthlyBudgets", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMonthlyBudget = async (req, res) => {
  try {
    const monthlyBudgetId = req.params.monthlyBudgetId;
    const { month, year, budgetAmount, expenses } = req.body;

    if (!month || !year || !budgetAmount) {
      return res
        .status(400)
        .json({ error: "Month, year, and budgetAmount are required." });
    }

    const updatedMonthlyBudget = await MonthlyBudget.findByIdAndUpdate(
      monthlyBudgetId,
      { month, year, budgetAmount, expenses },
      { new: true }
    );

    res.status(200).json({
      message: "MonthlyBudget updated successfully",
      updatedMonthlyBudget,
    });
  } catch (error) {
    console.error("Error updating MonthlyBudget", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteMonthlyBudget = async (req, res) => {
  try {
    const monthlyBudgetId = req.params.monthlyBudgetId;
    await MonthlyBudget.findByIdAndDelete(monthlyBudgetId);
    res.status(200).json({ message: "MonthlyBudget deleted successfully" });
  } catch (error) {
    console.error("Error deleting MonthlyBudget", error);
  }
};

module.exports = {
  addMonthlyBudget,
  getMonthlyBudgets,
  updateMonthlyBudget,
  deleteMonthlyBudget,
};
