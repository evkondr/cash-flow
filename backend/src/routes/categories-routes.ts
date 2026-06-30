import express from 'express'
import CategoriesController from '../controllers/categories-controller';


const categoriesRouter = express.Router();

categoriesRouter .get('/', CategoriesController.getCategories);
categoriesRouter .post('/', CategoriesController.createCategory);

export default categoriesRouter ;
