const express = require("express");
const expenseController = require("./expense.controller");

const router = express.Router();

// Routes for expenses
router.post("/addExpense", expenseController.addExpenses);
router.get("/getExpenses", expenseController.getExpenses);

module.exports = router;
