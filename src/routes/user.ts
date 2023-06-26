import { Router } from 'express';
import { UserControllers } from '../controllers/user';

export const userRouter = Router();

userRouter.get('/:id', UserControllers.getUser);
userRouter.get('/', UserControllers.getUsers);
userRouter.put('/update/:id', UserControllers.updateUser);
userRouter.delete('/delete/:id', UserControllers.deleteUser);
