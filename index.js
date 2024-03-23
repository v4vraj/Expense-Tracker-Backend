const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const db = require("./db");
const expenseRoutes = require("./SourceCode/expense/expense.route");
const userRoutes = require("./SourceCode/User/user.route");
const incomeRoutes = require("./SourceCode/income/income.route");
const weeklyExpenseRoutes = require("./SourceCode/weeklyBudget/weeklyBudget.route");
const monthlyBudgetRoutes = require("./SourceCode/monthlyBudget/monthlyBudget.route");
const groupRoutes = require("./SourceCode/Group/group.route");
const transactionRoutes = require("./SourceCode/groupTransactions/transcation.route");

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  },
});

app.use(cors());
app.use(express.json());

const groupController = require("./SourceCode/Group/group.controller");
groupController.setIO(io);

app.use("/api/user", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/weeklyBudget", weeklyExpenseRoutes);
app.use("/api/monthlyBudget", monthlyBudgetRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/groupTransaction", transactionRoutes);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
  socket.on("groupCreated", (data) => {
    console.log("Group created:", data);
    io.emit("groupCreated", data);
  });
  socket.on("userJoined", (data) => {
    console.log("User joined:", data);
    io.emit("userJoined", data);
  });
});

server.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
