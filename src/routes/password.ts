import { Router } from 'express';
import { PasswordRecovery } from '../controllers/password';

export const passwordRouter = Router();

passwordRouter.post('/forgot', PasswordRecovery.forgotPassword);
passwordRouter.post('/reset/:token', PasswordRecovery.resetPassword);
