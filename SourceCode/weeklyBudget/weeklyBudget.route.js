const express = require("express");
const router = express.Router();
const weeklyBudgetController = require("./weeklyBudget.controller");

router.post("/addWeeklyBudget", weeklyBudgetController.addWeeklyBudget);
router.get("/getWeeklyBudgets", weeklyBudgetController.getWeeklyBudgets);
router.put(
  "/updateWeeklyBudget/:weeklyBudgetId",
  weeklyBudgetController.updateWeeklyBudget
);
router.delete(
  "/deleteWeeklyBudget/:weeklyBudgetId",
  weeklyBudgetController.deleteWeeklyBudget
);

module.exports = router;
