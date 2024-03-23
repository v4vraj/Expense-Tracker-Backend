const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: String,
  description: String,
  amount: Number,
  status: Boolean,
  timestamp: { type: Date, default: Date.now },
});

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
