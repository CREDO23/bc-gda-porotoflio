import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

dotenv.config();

interface ICredentials {
    username: string;
    id: mongoose.Types.ObjectId;
}

export const signResetPasswordToken = ({
    username,
    id,
}: ICredentials): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            { username, id },
            process.env.PASSWORD_TOKEN_SECRET_KEY as string,
            {
                expiresIn: 60 * 5,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result as string);
            }
        );
    });
};
