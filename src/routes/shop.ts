import { Router } from 'express';
import { ShopControllers } from '../controllers/shop';

export const shopRouter = Router();

shopRouter.post('/', ShopControllers.create);
shopRouter.get('/', ShopControllers.getAll);
shopRouter.get('/:id', ShopControllers.getById);
shopRouter.put('/update/:id', ShopControllers.update);
shopRouter.delete('/delete/:id', ShopControllers.delete);
shopRouter.put('/gallery/add/:id', ShopControllers.addImgToGallery);
shopRouter.delete('/gallery/remove/:id', ShopControllers.removeImgFromGallery);
shopRouter.put('/payment_methods/add/:id', ShopControllers.addPaymentMethod);
shopRouter.delete(
    '/payment_methods/remove/:id',
    ShopControllers.removePaymentMethod
);
