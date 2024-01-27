// controllers/income.controller.js
const Income = require("./model/income.model");

const addIncome = async (req, res) => {
  try {
    const { userId, description, amount } = req.body;

    if (!userId || !description || !amount) {
      return res
        .status(400)
        .json({ error: "userId, Description and amount are required." });
    }

    const newIncome = new Income({
      userId,
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
    const userId = req.query.userId; // Change from req.body to req.query
    const incomes = await Income.find({ userId });
    res.status(200).json(incomes);
  } catch (error) {
    console.error("Error fetching Incomes", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addIncome, getIncomes };
``;
