const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const weeklyBudgetSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  monthForWeek: {
    type: String,
    required: true,
  },
  yearForWeek: {
    type: Number,
    required: true,
  },
  budgetAmount: {
    type: Number,
    required: true,
  },
  expenses: [expenseSchema],
});

const WeeklyBudget = mongoose.model("WeeklyBudget", weeklyBudgetSchema);

module.exports = WeeklyBudget;
