import { Router } from 'express';
import { PaymentMethodControllers } from '../controllers/paymentMethod';

export const paymentMethodsRouter = Router();

paymentMethodsRouter.post('/', PaymentMethodControllers.create);
paymentMethodsRouter.get('/', PaymentMethodControllers.getAll);
paymentMethodsRouter.get('/:id', PaymentMethodControllers.getById);
paymentMethodsRouter.put('/update/:id', PaymentMethodControllers.update);
paymentMethodsRouter.delete('/delete/:id', PaymentMethodControllers.delete);
