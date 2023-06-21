import * as mongoose from 'mongoose';
import * as express from 'express';
import { BcryptHelpers } from '../helpers/bcrypt';

const user = new mongoose.Schema<IUser>(
    {
        username: String,
        firstname: String,
        lastname: String,
        password: String,
        email: String,
        phoneNumber: String,
        roles: {
            type: [mongoose.Types.ObjectId],
            ref: 'userRoles',
        },
        country: String,
        city: String,
        adress_line1: String,
        adress_line2: String,
    },
    {
        timestamps: true,
    }
);

user.pre('save', async function (next: express.NextFunction) {
    if (!this.isModified('password')) next();

    this.password = await BcryptHelpers.hashPassword(this.password);

    next();
});

export const User = mongoose.model<IUser>('users', user);
