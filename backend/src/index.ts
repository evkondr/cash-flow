import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/auth-routes";
import categoriesRouter from "./routes/categories-routes";
import transactionsRouter from "./routes/transactions-route";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: "*",
  }),
);

//Routes
app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/auth", authRouter);

app.get("/", async (req, res) => {
  res.send("cash-flow api");
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
