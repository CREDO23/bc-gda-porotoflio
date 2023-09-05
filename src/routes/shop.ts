import { Router } from 'express';
import { ShopControllers } from '../controllers/shop';

export const shopRouter = Router();

shopRouter.post('/', ShopControllers.create);
shopRouter.get('/', ShopControllers.getAll);
shopRouter.get('/:id', ShopControllers.getById);
shopRouter.put('/update/:id', ShopControllers.update);
shopRouter.delete('/delete/:id', ShopControllers.delete);
