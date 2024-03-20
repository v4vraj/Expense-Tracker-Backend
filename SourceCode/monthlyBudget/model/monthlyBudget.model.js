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
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

const monthlyBudgetSchema = new mongoose.Schema({
  userId: String,
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  budgetAmount: {
    type: Number,
    required: true,
  },
  expenses: [expenseSchema],
});

const MonthlyBudget = mongoose.model("MonthlyBudget", monthlyBudgetSchema);

module.exports = MonthlyBudget;
