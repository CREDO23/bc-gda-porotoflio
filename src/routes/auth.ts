import { Router } from 'express';
import { AuthControllers } from '../controllers/auth';

export const authRouter = Router();

authRouter.post('/register', AuthControllers.register);
authRouter.post('/login', AuthControllers.login);
