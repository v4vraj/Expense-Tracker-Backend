const express = require("express");
const router = express.Router();
const groupTransactionController = require("./transaction.controller");

router.post(
  "/createTransactions",
  groupTransactionController.createTransactions
);

router.get(
  "/groupTransactions/:groupId",
  groupTransactionController.getAllGroupTransactions
);

router.get("/balances/:groupId", groupTransactionController.fetchUserBalances);

module.exports = router;
