// models/income.model.js
const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  // You can add more fields if needed
});

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
