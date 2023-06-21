import { Router } from 'express';
import { Auth } from '../controllers/auth';

export const authRouter = Router();

authRouter.post('/register', Auth.register);
authRouter.post('/login', Auth.login);
