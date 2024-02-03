// routes/income.routes.js
const express = require("express");
const router = express.Router();
const incomeController = require("./income.controller");

router.post("/addIncome", incomeController.addIncome);
router.get("/getIncomes", incomeController.getIncomes);
router.put("/updateIncome/:id", incomeController.updateIncome);
router.delete("/deleteIncome/:id", incomeController.deleteIncome);

module.exports = router;
