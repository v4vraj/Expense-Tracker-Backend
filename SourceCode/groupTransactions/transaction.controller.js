const mongoose = require("mongoose");
const GroupTransaction = require("./model/transaction.model");
const { ObjectId } = require("mongoose").Types;
const User = require("../User/model/user.model");

const createTransactions = async (req, res) => {
  try {
    const { group, amount, description, paidBy, splitBetween } = req.body;
    const totalAmount = parseFloat(amount);
    const share = totalAmount / splitBetween.length;
    const currentTime = new Date();

    // Fetch the ObjectId for paidBy
    const paidByUser = await User.findOne({ email: paidBy });
    if (!paidByUser) {
      return res.status(400).json({ error: "PaidBy user not found" });
    }

    // Iterate through each person in splitBetween array
    for (const payerEmail of splitBetween) {
      // Skip if the payer is the one who paid
      if (payerEmail === paidBy) continue;

      // Fetch the ObjectId for the current payer
      const payerUser = await User.findOne({ email: payerEmail });
      if (!payerUser) {
        return res
          .status(400)
          .json({ error: `User with email ${payerEmail} not found` });
      }

      // Check if there's an existing transaction document between the same source and destination within the group
      let groupTransaction = await GroupTransaction.findOne({
        group,
        source: payerEmail, // Use email directly
        destination: paidBy, // Use email directly
      });

      if (!groupTransaction) {
        // If no existing transaction document found, create a new one
        groupTransaction = new GroupTransaction({
          group,
          source: payerEmail, // Use email directly
          destination: paidBy, // Use email directly
          startTime: currentTime,
          endTime: currentTime,
          transactions: [],
          totalAmount: 0, // Initialize totalAmount to 0
        });
      }

      // Update transaction object for the current payer
      const transaction = {
        timestamp: currentTime,
        amount: share,
        description,
      };

      // Add the new transaction to the transactions array
      groupTransaction.transactions.push(transaction);

      // Update the total amount
      groupTransaction.totalAmount += share;

      // Save or update the group transaction document in the database
      await groupTransaction.save();

      console.log(`Transaction created successfully for payer: ${payerEmail}`);
    }

    res.status(201).json({ message: "Transactions created successfully." });
  } catch (error) {
    console.error("Error creating transactions:", error);
    res.status(500).json({ error: "Error creating transactions" });
  }
};
const fetchUserBalances = async (req, res) => {
  try {
    const { groupId } = req.params;
    const groupIdObject = new ObjectId(groupId);
    console.log(groupIdObject);

    const sourceBalances = await GroupTransaction.aggregate([
      { $match: { group: groupIdObject } },
      { $unwind: "$transactions" },
      { $group: { _id: "$source", debit: { $sum: "$transactions.amount" } } },
    ]);

    const destinationBalances = await GroupTransaction.aggregate([
      { $match: { group: groupIdObject } },
      { $unwind: "$transactions" },
      {
        $group: {
          _id: "$destination",
          credit: { $sum: "$transactions.amount" },
        },
      },
    ]);

    const mergedBalances = mergeBalances(sourceBalances, destinationBalances);
    console.log(mergedBalances);

    res.status(200).json({ balances: mergedBalances });
  } catch (error) {
    console.error("Error fetching user balances:", error);
    res.status(500).json({ error: "Error fetching user balances" });
  }
};

const mergeBalances = (sourceBalances, destinationBalances) => {
  const mergedBalances = new Map();

  sourceBalances.forEach(({ _id: user, debit }) => {
    mergedBalances.set(user, (mergedBalances.get(user) || 0) - debit);
  });

  destinationBalances.forEach(({ _id: user, credit }) => {
    mergedBalances.set(user, (mergedBalances.get(user) || 0) + credit);
  });

  return [...mergedBalances].map(([user, balance]) => ({ user, balance }));
};

// Get all group transactions
const getAllGroupTransactions = async (req, res) => {
  try {
    const groupTransactions = await GroupTransaction.find();
    res.status(200).json(groupTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific group transaction by ID
const getGroupTransactionById = async (req, res) => {
  try {
    const groupTransaction = await GroupTransaction.findById(req.params.id);

    if (!groupTransaction) {
      return res.status(404).json({ error: "Group Transaction not found" });
    }

    res.status(200).json(groupTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a specific group transaction by ID
const updateGroupTransactionById = async (req, res) => {
  try {
    const {
      group,
      source,
      destination,
      startTime,
      endTime,
      transactions,
      totalAmount,
    } = req.body;

    const updatedGroupTransaction = await GroupTransaction.findByIdAndUpdate(
      req.params.id,
      {
        group,
        source,
        destination,
        startTime,
        endTime,
        transactions,
        totalAmount,
      },
      { new: true }
    );

    if (!updatedGroupTransaction) {
      return res.status(404).json({ error: "Group Transaction not found" });
    }

    res.status(200).json(updatedGroupTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a specific group transaction by ID
const deleteGroupTransactionById = async (req, res) => {
  try {
    const deletedGroupTransaction = await GroupTransaction.findByIdAndDelete(
      req.params.id
    );

    if (!deletedGroupTransaction) {
      return res.status(404).json({ error: "Group Transaction not found" });
    }

    res.status(200).json(deletedGroupTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createTransactions,
  fetchUserBalances,
  getAllGroupTransactions,
  getGroupTransactionById,
  updateGroupTransactionById,
  deleteGroupTransactionById,
};
