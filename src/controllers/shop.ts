/* eslint-disable @typescript-eslint/no-shadow */
import * as error from 'http-errors';
import * as express from 'express';
import mongoose from 'mongoose';
import { Shop } from '../models/shop';
import { JOIShopValidation } from '../helpers/joi/shop';
import { ShopCategory } from '../models/shopCategory';

export class ShopControllers {
    static create = async (
        req: IUserRequest,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const result: IShop = await JOIShopValidation.create.validateAsync(
                req.body
            );

            const isExist = await Shop.find({
                name: {
                    $regex: new RegExp(result.name, 'i'),
                },
            });

            if (!isExist[0]) {
                const { category: shopCategory, paymentMethods } = result;

                const category = await ShopCategory.findById(shopCategory);

                if (!category) {
                    throw error.NotFound('Shop category not found');
                }

                const newShop = new Shop({ ...result, owner: req.user.id });

                const savedShop = await newShop.save();

                res.json(<IClientResponse>{
                    message: 'Shop created successfully',
                    data: savedShop,
                    error: null,
                    success: true,
                });
            } else {
                throw error.Conflict('Shop already exist');
            }
        } catch (error) {
            next(error);
        }
    };

    static getAll = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const shops = await Shop.find({});

            if (shops.length) {
                res.json(<IClientResponse>{
                    message: 'Shops',
                    data: shops,
                    error: null,
                    success: true,
                });
            } else {
                res.json(<IClientResponse>{
                    message: 'Not shops yet',
                    data: [],
                    error: null,
                    success: true,
                });
            }
        } catch (error) {
            next(error);
        }
    };

    static getById = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            if (mongoose.isValidObjectId(id)) {
                const shop = await Shop.findById(id);

                if (shop) {
                    res.json(<IClientResponse>{
                        message: 'Shop',
                        data: shop,
                        error: null,
                        success: true,
                    });
                } else {
                    throw error.NotFound('Shop not found');
                }
            } else {
                throw error.NotAcceptable('Invalid id');
            }
        } catch (error) {
            next(error);
        }
    };

    static update = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            if (mongoose.isValidObjectId(id)) {
                const result = await JOIShopValidation.update.validateAsync(
                    req.body
                );

                const updatedShop = await Shop.findByIdAndUpdate(
                    id,
                    { ...result },
                    { new: true }
                );

                if (updatedShop) {
                    res.json(<IClientResponse>{
                        message: 'Shop saved',
                        data: updatedShop,
                        error: null,
                        success: true,
                    });
                } else {
                    throw error.NotFound('Shop not found');
                }
            } else {
                throw error.NotAcceptable('Invalid id');
            }
        } catch (error) {
            next(error);
        }
    };

    static delete = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            if (mongoose.isValidObjectId(id)) {
                const deleted = await Shop.findByIdAndDelete(id);

                if (deleted) {
                    res.json(<IClientResponse>{
                        message: 'Deleted successfully',
                        data: null,
                        error: null,
                        success: true,
                    });
                } else {
                    throw error.NotFound('Shop not found');
                }
            } else {
                throw error.NotAcceptable('Invalid id');
            }
        } catch (error) {
            next(error);
        }
    };
}
