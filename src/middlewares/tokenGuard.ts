import * as jwt from 'express-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

export const tokenGuard = () => {
    return jwt
        .expressjwt({
            secret: process.env.ACCESS_TOKEN_SECRET_KEY,
            algorithms: ['HS256'],
        })
        .unless({
            path: ['/api', /\/api\/auth\/*/],
        });
};
