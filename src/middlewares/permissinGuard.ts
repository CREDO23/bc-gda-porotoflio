/* eslint-disable @typescript-eslint/no-shadow */
import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import * as error from 'http-errors';

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
            const token = req.headers.authorization.split(' ')[0] ?? null;

            if (token) {
                const decodedUser: jwt.JwtPayload = await new Promise(
                    (resolve, reject) =>
                        jwt.verify(
                            token,
                            process.env.ACCESS_TOKEN_SECRET_KEY,
                            (err, decoded) => {
                                if (err) {
                                    reject(err);
                                }

                                resolve(decoded as jwt.JwtPayload);
                            }
                        )
                );

                const hasPermission = decodedUser.permissions.some((value) =>
                    allowed.includes(value)
                );

                if (hasPermission) {
                    req.user = decodedUser;
                } else {
                    throw error.Forbidden('Denied access');
                }
            } else {
                throw error.Unauthorized('Unauthorized request');
            }
        } catch (error) {
            next(error);
        }
    };
