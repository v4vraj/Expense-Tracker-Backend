// models/income.model.js
const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
});

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
