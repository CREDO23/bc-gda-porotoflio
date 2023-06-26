/* eslint-disable @typescript-eslint/no-shadow */
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { JWTHelpers } from '../helpers/jwt';
import * as error from 'http-errors';

dotenv.config();

export const tokenGuard = async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1] ?? null;

        if (token) {
            const decodedUser: jwt.JwtPayload = await JWTHelpers.verifyToken(
                token
            );

            req.user = decodedUser;
            next();
        } else {
            throw error.Unauthorized('Unauthorized , request');
        }
    } catch (error) {
        next(error);
    }
};
