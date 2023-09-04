import { Router } from 'express';
import { ShopCategoryControllers } from '../controllers/shopCategory';

export const shopCategoriesRouter = Router();

shopCategoriesRouter.post('/', ShopCategoryControllers.create)
shopCategoriesRouter.get('/', ShopCategoryControllers.getAll);
shopCategoriesRouter.get('/:id', ShopCategoryControllers.getById);
shopCategoriesRouter.put('/update/:id', ShopCategoryControllers.update);
shopCategoriesRouter.delete('/delete/:id', ShopCategoryControllers.delete);
