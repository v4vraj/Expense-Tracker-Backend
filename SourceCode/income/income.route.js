const express = require("express");
const router = express.Router();
const incomeController = require("./income.controller");

router.post("/addIncome", incomeController.addIncome);
router.get("/getIncomes", incomeController.getIncomes);
router.put("/updateIncome/:incomeId", incomeController.updateIncome);
router.delete("/deleteIncome/:incomeId", incomeController.deleteIncome);

module.exports = router;
