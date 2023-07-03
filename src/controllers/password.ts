/* eslint-disable @typescript-eslint/no-shadow */
import { User } from '../models/user';
import { Request, Response, NextFunction } from 'express';
import { signResetPasswordToken } from '../helpers/password';
import forgotPasswordMail from '../helpers/nodemailer/forgotPassword';
import * as dotenv from 'dotenv';
import * as error from 'http-errors';
import resetPasswordEmail from '../helpers/nodemailer/resetPassword';
import { JWTHelpers } from '../helpers/jwt';
import { BcryptHelpers } from '../helpers/bcrypt';

dotenv.config();

export class PasswordRecovery {
    static forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { username } = req.body;

            const user = await User.findOne({ where: { username } });

            if (user) {
                const token = await signResetPasswordToken({
                    username: user.username,
                    id: user._id,
                });

                const link = `${process.env.FRONTEND_URL}/password/forgot/${token}`;

                const emailSent = await forgotPasswordMail.send(
                    user,
                    'Forgot Password',
                    { link, receiver: user.username }
                );

                if (emailSent) {
                    res.json(<IClientResponse>{
                        message:
                            'We have sent a recovery password link to your email address , check your inbox',
                        data: emailSent,
                        success: true,
                        error: null,
                    });
                } else {
                    res.json(<IClientResponse>{
                        message:
                            'We have sent a recovery password link to your email address , check your inbox',
                        data: null,
                        success: true,
                        error: null,
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    };

    static resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { password } = req.body;

            const hash = await BcryptHelpers.hashPassword(password);

            const { token } = req.params;

            const decode = await JWTHelpers.verifyToken(
                token,
                process.env.PASSWORD_TOKEN_SECRET_KEY
            );

            if (decode) {
                const user = await User.findByIdAndUpdate(decode.id, {
                    $set: { password: hash },
                });

                if (user) {
                    const link = `${process.env.FRONTEND_URL}/login`;

                    const emailSent = await resetPasswordEmail.send(
                        user,
                        'Reset Password',
                        { link, receiver: user.username }
                    );

                    if (emailSent) {
                        res.json(<IClientResponse>{
                            message: 'Password updated successfully',
                            data: user,
                            error: null,
                            success: true,
                        });
                    }
                } else {
                    throw new error.NotImplemented(
                        'Could not reset the password , try again later'
                    );
                }
            }
        } catch (error) {
            if (error.message == 'jwt expired') {
                error.message = 'Link expired';
            }
            next(error);
        }
    };
}
