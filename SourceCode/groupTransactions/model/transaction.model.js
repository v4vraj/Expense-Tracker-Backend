const mongoose = require("mongoose");

const groupTransactionSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  source: {
    type: String, // Change type to String for email
    required: true,
  },
  destination: {
    type: String, // Change type to String for email
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  transactions: [
    {
      timestamp: {
        type: Date,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
});

const GroupTransaction = mongoose.model(
  "GroupTransaction",
  groupTransactionSchema
);

module.exports = GroupTransaction;
