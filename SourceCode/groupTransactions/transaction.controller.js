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
        source: payerEmail,
        destination: paidBy,
      });

      if (!groupTransaction) {
        // If no existing transaction document found, create a new one
        groupTransaction = new GroupTransaction({
          group,
          source: payerEmail,
          destination: paidBy,
          startTime: currentTime,
          endTime: currentTime,
          transactions: [],
          totalAmount: 0,
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
    const { userEmail } = req.query;

    // Aggregate transactions to get source balances (owed)
    const sourceBalances = await GroupTransaction.aggregate([
      { $match: { group: groupIdObject } },
      { $unwind: "$transactions" },
      { $group: { _id: "$source", owed: { $sum: "$transactions.amount" } } },
    ]);

    // Aggregate transactions to get destination balances (owes)
    const destinationBalances = await GroupTransaction.aggregate([
      { $match: { group: groupIdObject } },
      { $unwind: "$transactions" },
      {
        $group: {
          _id: "$destination",
          owes: { $sum: "$transactions.amount" },
        },
      },
    ]);

    // Merge source (owed) and destination (owes) balances
    const mergedBalances = mergeBalances(sourceBalances, destinationBalances);
    // Find the logged-in user's balance and owed/owes amounts
    let userTotalBalance = 0;
    const userOwes = [];
    const userOwedFrom = [];

    mergedBalances.forEach(({ user, balance }) => {
      if (user === userEmail) {
        userTotalBalance = balance;
      } else if (balance > 0) {
        userOwes.push({ user, amount: balance });
      } else if (balance < 0) {
        userOwedFrom.push({ user, amount: -balance });
      }
    });

    // Send the total balance, owed amounts, and amounts owed as a JSON response
    res.status(200).json({
      totalBalance: userTotalBalance,
      owes: userOwes,
      owedFrom: userOwedFrom,
    });
  } catch (error) {
    console.error("Error fetching user balances:", error);
    res.status(500).json({ error: "Error fetching user balances" });
  }
};

const mergeBalances = (sourceBalances, destinationBalances) => {
  const mergedBalances = new Map();

  // Process source balances (owed)
  sourceBalances.forEach(({ _id: user, owed }) => {
    mergedBalances.set(user, (mergedBalances.get(user) || 0) - owed);
  });

  // Process destination balances (owes)
  destinationBalances.forEach(({ _id: user, owes }) => {
    mergedBalances.set(user, (mergedBalances.get(user) || 0) + owes);
  });

  return [...mergedBalances].map(([user, balance]) => ({ user, balance }));
};

const getAllGroupTransactions = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Fetch all transactions with the given groupId
    const transactions = await GroupTransaction.find({ group: groupId });

    // Extract source, destination, and transactions from each document
    const formattedTransactions = transactions.map((transaction) => {
      const {
        source,
        destination,
        transactions: transactionDetails,
      } = transaction;
      return {
        source,
        destination,
        transactions: transactionDetails.map(
          ({ timestamp, amount, description }) => ({
            timestamp,
            amount,
            description,
          })
        ),
      };
    });
    res.status(200).json(formattedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

module.exports = {
  createTransactions,
  fetchUserBalances,
  getAllGroupTransactions,
};
