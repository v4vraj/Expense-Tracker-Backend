const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: String,
  description: String,
  amount: Number,
  status: Boolean,
  timestamp: { type: Date, default: Date.now },
});
const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
