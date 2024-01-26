// controllers/income.controller.js
const Income = require("./model/income.model");

const addIncome = async (req, res) => {
  try {
    const { description, amount } = req.body;

    if (!description || !amount) {
      return res
        .status(400)
        .json({ error: "Description and amount are required." });
    }

    const newIncome = new Income({
      description,
      amount,
    });

    await newIncome.save();

    res.status(200).json({ message: "Income added successfully" });
  } catch (error) {
    console.error("Error adding Income", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();
    res.status(200).json(incomes);
  } catch (error) {
    console.error("Error fetching Incomes", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addIncome, getIncomes };
