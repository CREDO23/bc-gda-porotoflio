/* eslint-disable @typescript-eslint/no-shadow */
import * as error from 'http-errors';
import * as express from 'express';
import { PaymentMethod } from '../models/paymentMethod';
import mongoose from 'mongoose';
import { JOIPaymentMethodValidation } from '../helpers/joi/paymentMethod';

export class PaymentMethodControllers {
    static create = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const result: IShopCategory =
                await JOIPaymentMethodValidation.create.validateAsync(req.body);

            const isExist = await PaymentMethod.find({
                name: {
                    $regex: new RegExp(result.name, 'i'),
                },
            });

            if (!isExist[0]) {
                const newPaymentMethod = new PaymentMethod({ ...result });

                const savedPaymentMethod = await newPaymentMethod.save();

                res.json(<IClientResponse>{
                    message: 'Payment method created successfully',
                    data: savedPaymentMethod,
                    error: null,
                    success: true,
                });
            } else {
                throw error.Conflict('Payment method already exist');
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
            const paymentMethods = await PaymentMethod.find({});

            if (paymentMethods.length) {
                res.json(<IClientResponse>{
                    message: 'Payment methods',
                    data: paymentMethods,
                    error: null,
                    success: true,
                });
            } else {
                res.json(<IClientResponse>{
                    message: 'Not payment methods yet',
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
                const paymentMethod = await PaymentMethod.findById(id);

                if (paymentMethod) {
                    res.json(<IClientResponse>{
                        message: 'Payment method',
                        data: paymentMethod,
                        error: null,
                        success: true,
                    });
                } else {
                    throw error.NotFound('Payment method not found');
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
                    await JOIPaymentMethodValidation.update.validateAsync(
                        req.body
                    );

                const updatedPaymentMethod =
                    await PaymentMethod.findByIdAndUpdate(
                        id,
                        { ...result },
                        { new: true }
                    );

                if (updatedPaymentMethod) {
                    res.json(<IClientResponse>{
                        message: 'Payment method saved',
                        data: updatedPaymentMethod,
                        error: null,
                        success: true,
                    });
                } else {
                    throw error.NotFound('Payment method not found');
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
                const deleted = await PaymentMethod.findByIdAndDelete(id);

                if (deleted) {
                    res.json(<IClientResponse>{
                        message: 'Deleted successfully',
                        data: null,
                        error: null,
                        success: true,
                    });
                } else {
                    throw error.NotFound('Payment method not found');
                }
            } else {
                throw error.NotAcceptable('Invalid id');
            }
        } catch (error) {
            next(error);
        }
    };
}
