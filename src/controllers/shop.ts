/* eslint-disable @typescript-eslint/no-shadow */
import * as error from 'http-errors';
import * as express from 'express';
import mongoose from 'mongoose';
import { Shop } from '../models/shop';
import { JOIShopValidation } from '../services/validations/shop';
import { ShopCategory } from '../models/shopCategory';
import { PaymentMethod } from '../models/paymentMethod';
import { DocumentExistenceService } from '../services/isDocumentExist';
import { removeDuplicatedItem } from '../helpers/removeDuplicated';
import { DocumentGetterService } from '../services/getDocument';
import { PaymentMethodService } from '../services/shop/paymentMethod';
import { ImageGalleryService } from '../services/shop/imageGallery';

export class ShopControllers {
    private static getDocument = new DocumentGetterService(Shop);

    static create = async (
        req: IUserRequest,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const result: IShop = await JOIShopValidation.create.validateAsync(
                req.body
            );

            const {
                category: shopCategory,
                name: shopName,
                paymentMethods,
            } = result;

            const cleanPaymentMethods = removeDuplicatedItem(
                paymentMethods as unknown as string[]
            );

            // chech if the shop exists
            const shopExistence = new DocumentExistenceService(Shop);

            const isShopExists = await shopExistence.withQuery({
                name: { $regex: new RegExp(shopName, 'i') },
            });

            if (isShopExists) {
                throw error.Conflict(
                    `Shop with name ${shopName} already exists`
                );
            }

            // check if the shop category exists
            const shopCategoryExistence = new DocumentExistenceService(
                ShopCategory
            );

            const isCategoryExist = await shopCategoryExistence.byId(
                shopCategory
            );

            if (!isCategoryExist) {
                throw error.NotFound(
                    `The category "${shopCategory}" is not found`
                );
            }

            // check if the payment methods exist
            const paymentMethodExistence = new DocumentExistenceService(
                PaymentMethod
            );

            await Promise.all(
                cleanPaymentMethods.map(async (paymentMethodId) => {
                    const isPayMethExist = await paymentMethodExistence.byId(
                        paymentMethodId
                    );

                    if (!isPayMethExist) {
                        throw error.NotFound(
                            `The payment method "${paymentMethodId}" is not found`
                        );
                    }
                })
            );

            // create and save the shop
            const newShop = new Shop({
                ...result,
                owner: req.user.id,
                paymentMethods: cleanPaymentMethods,
            });

            const savedShop = await newShop.save();

            const populated = await savedShop.populate([
                { path: 'owner', select: 'username email roles' },
                {
                    path: 'category',
                },
                {
                    path: 'paymentMethods',
                },
            ]);

            res.json(<IClientResponse>{
                message: 'Shop created successfully',
                data: populated,
                error: null,
                success: true,
            });
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
            const shops = await this.getDocument.all();

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

            const shop = await this.getDocument.byId(id);

            res.json(<IClientResponse>{
                message: 'Shop',
                data: shop,
                error: null,
                success: true,
            });
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

    static addPaymentMethod = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { id: shopId } = req.params;

            const result = await JOIShopValidation.paymentMethod.validateAsync(
                req.body
            );

            const shop = await PaymentMethodService.add(
                shopId,
                result.paymentMethodIds
            );

            res.json(<IClientResponse>{
                message: 'Payment Method (s) added successfully',
                data: shop,
                error: null,
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    static removePaymentMethod = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { id: shopId } = req.params;

            const result = await JOIShopValidation.paymentMethod.validateAsync(
                req.body
            );

            const shop = await PaymentMethodService.remove(
                shopId,
                result.paymentMethodIds
            );

            res.json(<IClientResponse>{
                message: 'Payment Method removed successfully',
                data: shop,
                error: null,
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    static addImgToGallery = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { id: shopId } = req.params;

            const result = await JOIShopValidation.gallery.validateAsync(
                req.body
            );

            const shop = await ImageGalleryService.add(shopId, result.images);

            res.json(<IClientResponse>{
                message: 'Image added successfully',
                data: shop,
                error: null,
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    static removeImgFromGallery = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { id: shopId } = req.params;

            const result = await JOIShopValidation.gallery.validateAsync(
                req.body
            );

            const shop = await ImageGalleryService.remove(
                shopId,
                result.images
            );

            res.json(<IClientResponse>{
                message: 'Image(s) removed successfully',
                data: shop,
                error: null,
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };
}
