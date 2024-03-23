const Income = require("./model/income.model");

const addIncome = async (req, res) => {
  try {
    const { userId, description, amount, status, timestamp } = req.body;

    const newIncome = new Income({
      userId,
      description,
      amount,
      status,
      timestamp,
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
    const userId = req.query.userId;
    const filters = { userId };
    if (req.query.startDate && req.query.endDate) {
      const startOfDay = new Date(req.query.startDate);
      const endOfDay = new Date(req.query.endDate);

      startOfDay.setUTCHours(0, 0, 0, 0);

      endOfDay.setUTCHours(23, 59, 59, 999);

      filters.timestamp = {
        $gte: startOfDay.toISOString(),
        $lte: endOfDay.toISOString(),
      };
    }

    const incomes = await Income.find(filters);

    res.status(200).json(incomes);
  } catch (error) {
    console.error("Error fetching Incomes", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateIncome = async (req, res) => {
  try {
    const incomeId = req.params.incomeId;
    const { description, amount, status } = req.body;

    if (!description || !amount) {
      return res
        .status(400)
        .json({ error: "Description and amount are required." });
    }

    const updateIncome = await Income.findByIdAndUpdate(
      incomeId,
      { description, amount, status },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Expense updated successfully", updateIncome });
  } catch (error) {
    console.error("Error updating Expense", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    await Income.findByIdAndDelete(incomeId);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting Income", error);
  }
};

module.exports = { addIncome, getIncomes, updateIncome, deleteIncome };
