const express = require("express");
const router = express.Router();
const groupTransactionController = require("./transaction.controller");

// Create a new group transaction
router.post(
  "/createTransactions",
  groupTransactionController.createTransactions
);

// Get all group transactions
router.get(
  "/groupTransactions",
  groupTransactionController.getAllGroupTransactions
);

router.get("/balances/:groupId", groupTransactionController.fetchUserBalances);

// Get a specific group transaction by ID
router.get(
  "/groupTransactions/:id",
  groupTransactionController.getGroupTransactionById
);

// Update a specific group transaction by ID
router.put(
  "/groupTransactions/:id",
  groupTransactionController.updateGroupTransactionById
);

// Delete a specific group transaction by ID
router.delete(
  "/groupTransactions/:id",
  groupTransactionController.deleteGroupTransactionById
);

module.exports = router;
