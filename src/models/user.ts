import * as mongoose from 'mongoose';

const user = new mongoose.Schema(
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

export const User = mongoose.model<IUser>('users', user);
