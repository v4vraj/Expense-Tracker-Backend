// models/income.model.js
const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: String,
  description: String,
  amount: Number,
  status: Boolean, // If needed, you can keep the status field
  timestamp: { type: Date, default: Date.now },
});

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
