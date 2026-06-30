import { Request, Response } from 'express';
import { prisma } from '../utils/prisma-client';
class CategoriesController {
  static async getCategories(req:Request, res:Response) {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error'})
    }
  }
  static async createCategory(req:Request, res:Response) {
    try {
      const { name } = req.body;
      if(!name){
        res.status(400).json({ message: 'Name is required'});
      }
      const newCategory = await prisma.category.create({
        data: {
          name: name.toLowerCase()
        }
      });
      res.status(200).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error'})
    }
  }
}

export default CategoriesController