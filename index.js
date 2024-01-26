const express = require("express");
const cors = require("cors");
const db = require("./db");
const expenseRoutes = require("./SourceCode/expense/expense.route");
const userRoutes = require("./SourceCode/User/user.route");
const incomeRoutes = require("./SourceCode/income/income.route");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
