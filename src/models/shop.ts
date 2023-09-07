import * as mongoose from 'mongoose';
import * as express from 'express';
import { ShopCategory } from './shopCategory';
import * as error from 'http-errors';

const shopModel = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    name: String,
    category: { type: mongoose.Types.ObjectId, ref: 'shopCategories' },
    description: String,
    paymentMethods: {
        type: [mongoose.Types.ObjectId],
        default: [],
        ref: 'paymentMethods',
    },
    products: { type: [mongoose.Types.ObjectId], default: [], ref: 'products' },
    imageUrl: String,
    gallery: { type: [String], default: [] },
    status: {
        type: String,
        default: 'CREATED',
    },
    owner: { type: mongoose.Types.ObjectId, ref: 'users' },
});

export const Shop = mongoose.model<IShop>('shops', shopModel);

shopModel.pre('save', async function (next: express.NextFunction) {
    const isCategoryModified = this.isModified('category');
    const isNameModified = this.isModified('name');

    if (isCategoryModified) {
        const category = await ShopCategory.findById(this.category);

        if (!category) {
            next(
                error.NotFound('The category you provided has not been found')
            );
        }
    }

    if (isNameModified) {
        const isExist = await Shop.find({
            name: {
                $regex: new RegExp(this.name, 'i'),
            },
        });

        if (isExist) {
            next(error.Conflict('The name you provided is already taken'));
        }
    }

    next();
});
