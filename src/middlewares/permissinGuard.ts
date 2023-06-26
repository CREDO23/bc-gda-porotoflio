/* eslint-disable @typescript-eslint/no-shadow */
import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import * as error from 'http-errors';
import { User } from '../models/user';

interface IUserRequest extends express.Request {
    user: jwt.JwtPayload;
}

export const permissionGuard =
    (allowed: string[]) =>
    async (
        req: IUserRequest,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            if (req.user) {
                const userId = req.user.id;

                const userRoles = (await User.findById(userId)).roles;

                const hasPermission = userRoles.some((value) =>
                    allowed.includes(value)
                );

                if (hasPermission) {
                    next();
                } else {
                    throw error.Forbidden('Permission denied');
                }
            } else {
                throw error.Unauthorized('Unauthorized ----- request');
            }
        } catch (error) {
            next(error);
        }
    };
