import express from 'express'
import TransactionsController from '../controllers/transactions-controller';

const transactionsRouter = express.Router();

transactionsRouter.get('/', TransactionsController.getTransactions);
transactionsRouter.post('/', TransactionsController.createTransaction);

export default transactionsRouter;
