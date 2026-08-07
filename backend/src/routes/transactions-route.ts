import express from "express";
import TransactionsController from "../controllers/transactions-controller";
import authMiddleware from "../middleware/authMiddleware";

const transactionsRouter = express.Router();

transactionsRouter.use(authMiddleware);

transactionsRouter.get("/", TransactionsController.getTransactions);
transactionsRouter.get("/:id", TransactionsController.getTransactionById);
transactionsRouter.get(
  "/:userId",
  TransactionsController.getTransactionsByUserId,
);
transactionsRouter.get("/summary/:id", TransactionsController.getSummaryById);
transactionsRouter.post("/", TransactionsController.createTransaction);
transactionsRouter.delete("/:id", TransactionsController.deleteTransaction);

export default transactionsRouter;
