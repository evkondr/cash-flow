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
  static async getTransactionById(req:Request, res:Response) {
    try {
      const { id } = req.params as { id: string};
      if(isNaN(parseInt(id))){
        res.status(400).json({ message: " id is not a number"});  
      }
      const transaction = await prisma.transactions.findUnique({
        where: {
          id: parseInt(id)
        }
      });
      res.status(200).json(transaction);
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
      console.log(error);
      return res.status(500).json({ message: 'Unexpected server error'})
    }
  }
  static async deleteTransaction(req:Request, res:Response) {
    try {
      const { id } = req.params as { id: string};
      const transactions = await prisma.transactions.delete({
        where: {
          id: parseInt(id)
        }
      });
      res.status(200).json(transactions);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Unexpected server error'})
    }
  }
  static async getSummaryById(req:Request, res:Response) {
    try {
      const { id } = req.params as { id: string};
      const balanceResult = await prisma.transactions.aggregate({
        where: {
          userId: parseInt(id),
        },
        _sum: {
          amount: true
        }
      });
      const incomeResult = await prisma.transactions.aggregate({
        where: {
          userId: parseInt(id),
          'AND': { amount: { gt: 0 } }
        },
        _sum: {
          amount: true
        }
      });
      const expensesResult = await prisma.transactions.aggregate({
        where: {
          userId: parseInt(id),
          'AND': { amount: { lt: 0 } }
        },
        _sum: {
          amount: true
        }
      });
      res.status(200).json({
        balance: balanceResult._sum.amount,
        income: incomeResult._sum.amount,
        expenses: expensesResult._sum.amount
      });
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error'})
    }
  }
}

export default TransactionsController