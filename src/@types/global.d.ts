import express from 'express';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

declare global {
    interface IClientResponse {
        message: string;
        data: unknown;
        error: unknown;
        success: boolean;
    }

    interface IUser {
        id: mongoose.Types.ObjectId;
        username: string;
        firstname: string;
        lastname: string;
        password: string;
        email: string;
        phoneNumber: string;
        roles: string[];
        country: string;
        city: string;
        adress_line1: string;
        adress_line2: string;
    }

    interface IUserRequest extends express.Request {
        user: jwt.JwtPayload;
    }
}
