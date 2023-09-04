/* eslint-disable @typescript-eslint/no-shadow */
import * as error from 'http-errors';
import * as express from 'express';
import { ShopCategory } from '../models/shopCategory';
import mongoose from 'mongoose';
import { JOIShopCategoryValidation } from '../helpers/joi/shopCategory';

export class ShopCategoryControllers {
    static create = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const result: IShopCategory =
                await JOIShopCategoryValidation.create.validateAsync(req.body);

            const isExist = await ShopCategory.find({
                name: {
                    $regex: new RegExp(result.name, 'i'),
                },
            });

            if (!isExist[0]) {
                const newCategory = new ShopCategory({ ...result });

                const savedCategory = await newCategory.save();

                res.json(<IClientResponse>{
                    message: 'Category saved',
                    data: savedCategory,
                    error: null,
                    success: true,
                });
            } else {
                throw error.Conflict('Category already exist');
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
            const categories = await ShopCategory.find({});

            if (categories.length) {
                res.json(<IClientResponse>{
                    message: 'Shop categories',
                    data: categories,
                    error: null,
                    success: true,
                });
            } else {
                res.json(<IClientResponse>{
                    message: 'Not categories yet',
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
                const category = await ShopCategory.findById(id);

                if (category) {
                    res.json(<IClientResponse>{
                        message: 'Category',
                        data: category,
                        error: null,
                        success: true,
                    });
                } else {
                    throw error.NotFound('Category not found');
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
                const result =
                    await JOIShopCategoryValidation.update.validateAsync(
                        req.body
                    );

                const updatedCategory = await ShopCategory.findByIdAndUpdate(
                    id,
                    { ...result },
                    { new: true }
                );

                if (updatedCategory) {
                    res.json(<IClientResponse>{
                        message: 'Category saved',
                        data: updatedCategory,
                        error: null,
                        success: true,
                    });
                } else {
                    throw error.NotFound('Category not found');
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
                const deleted = await ShopCategory.findByIdAndDelete(id);

                if (deleted) {
                    res.json(<IClientResponse>{
                        message: 'Deleted successfully',
                        data: null,
                        error: null,
                        success: true,
                    });
                } else {
                    throw error.NotFound('Category not found');
                }
            } else {
                throw error.NotAcceptable('Invalid id');
            }
        } catch (error) {
            next(error);
        }
    };
}
