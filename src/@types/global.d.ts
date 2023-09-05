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
        imageUrl: string;
        phoneNumber: string;
        roles: mongoose.Types.ObjectId[];
        shops: mongoose.Types.ObjectId[];
        country: string;
        city: string;
        adress_line1: string;
        adress_line2: string;
    }

    interface IShop {
        id: mongoose.Types.ObjectId;
        name: string;
        category: mongoose.Types.ObjectId;
        description: string;
        imageUrl: string;
        gallery: string[];
        paymentMethods: mongoose.Types.ObjectId[];
        products: mongoose.Types.ObjectId[];
        owner: mongoose.Types.ObjectId;
        status: 'CREATED' | 'PUBLISHED';
    }

    interface IPaymentMethod {
        id: mongoose.Types.ObjectId;
        name: string;
        description: string;
    }

    interface IShopCategory {
        id: mongoose.Types.ObjectId;
        name: string;
        description: string;
    }

    interface IUserRole {
        id: mongoose.Types.ObjectId;
        name: string;
        description: string;
    }

    interface IUserRequest extends express.Request {
        user: jwt.JwtPayload;
    }
}
