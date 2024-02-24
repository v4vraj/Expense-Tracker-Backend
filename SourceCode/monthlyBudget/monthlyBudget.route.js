// routes/monthlyBudget.routes.js
const express = require("express");
const router = express.Router();
const monthlyBudgetController = require("./monthlyBudget.controller");

router.post("/addMonthlyBudget", monthlyBudgetController.addMonthlyBudget);
router.get("/getMonthlyBudgets", monthlyBudgetController.getMonthlyBudgets);
router.put(
  "/updateMonthlyBudget/:monthlyBudgetId",
  monthlyBudgetController.updateMonthlyBudget
);
router.delete(
  "/deleteMonthlyBudget/:monthlyBudgetId",
  monthlyBudgetController.deleteMonthlyBudget
);

module.exports = router;
