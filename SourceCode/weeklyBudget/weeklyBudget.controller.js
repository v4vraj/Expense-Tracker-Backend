const WeeklyBudget = require("./model/weeklyBudget.model");

const addWeeklyBudget = async (req, res) => {
  try {
    const {
      userId,
      startDate,
      endDate,
      monthForWeek,
      yearForWeek,
      budgetAmount,
      expenses,
    } = req.body;

    const newWeeklyBudget = new WeeklyBudget({
      userId,
      startDate,
      endDate,
      monthForWeek,
      yearForWeek,
      budgetAmount,
      expenses,
    });

    await newWeeklyBudget.save();

    res.status(200).json({ message: "WeeklyBudget added successfully" });
  } catch (error) {
    console.error("Error adding WeeklyBudget", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getWeeklyBudgets = async (req, res) => {
  try {
    const userId = req.query.userId;
    const weeklyBudgets = await WeeklyBudget.find({ userId: userId });
    res.status(200).json(weeklyBudgets);
  } catch (error) {
    console.error("Error fetching WeeklyBudgets", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateWeeklyBudget = async (req, res) => {
  try {
    const weeklyBudgetId = req.params.weeklyBudgetId;
    const {
      startDate,
      endDate,
      monthForWeek,
      yearForWeek,
      budgetAmount,
      expenses,
    } = req.body;

    if (
      !startDate ||
      !endDate ||
      !monthForWeek ||
      !yearForWeek ||
      !budgetAmount ||
      !expenses
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const updatedWeeklyBudget = await WeeklyBudget.findByIdAndUpdate(
      weeklyBudgetId,
      { startDate, endDate, monthForWeek, yearForWeek, budgetAmount, expenses },
      { new: true }
    );

    res.status(200).json({
      message: "WeeklyBudget updated successfully",
      updatedWeeklyBudget,
    });
  } catch (error) {
    console.error("Error updating WeeklyBudget", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteWeeklyBudget = async (req, res) => {
  try {
    const weeklyBudgetId = req.params.id;
    await WeeklyBudget.findByIdAndDelete(weeklyBudgetId);
    res.status(200).json({ message: "WeeklyBudget deleted successfully" });
  } catch (error) {
    console.error("Error deleting WeeklyBudget", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addWeeklyBudget,
  getWeeklyBudgets,
  updateWeeklyBudget,
  deleteWeeklyBudget,
};
