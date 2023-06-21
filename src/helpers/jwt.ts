import * as jwt from 'jsonwebtoken';

export class JWTHelpers {
    static signAccessToken = (payload: object): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET_KEY,
                {
                    expiresIn: '25d',
                },
                (error, token) => {
                    if (error) {
                        reject(error);
                    }

                    resolve(token);
                }
            );
        });
    };

    static verifyToken = (token: string): Promise<jwt.JwtPayload> => {
        return new Promise<jwt.JwtPayload>((resolve, reject) => {
            jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET_KEY,
                (err, decoded) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(decoded as jwt.JwtPayload);
                }
            );
        });
    };
}
