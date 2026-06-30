import { Request, Response } from "express";
import { prisma } from "../utils/prisma-client";

class TransactionsController {
  static async getTransactions(req:Request, res:Response) {
    try {
      const transactions = await prisma.transactions.findMany();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error'})
    }
  }
  static async getTransactionsByUserId(req:Request, res:Response) {
    try {
      const { userId } = req.params as { userId: string};
      const transactions = await prisma.transactions.findMany({
        where: {
          userId: parseInt(userId)
        }
      });
      res.status(200).json(transactions);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Unexpected server error'})
    }
  }
  static async createTransaction(req:Request, res:Response) {
    try {
      const { title, amount, userId, categoryId } = req.body;

      const transactions = await prisma.transactions.create({
        data: {
          title,
          amount,
          userId,
          category: {
            connect: {
              id: categoryId as number
            }
          }
        }
      });
      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).json({ message: 'Unexpected server error'})
    }
  }
}

export default TransactionsController