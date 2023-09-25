/* eslint-disable @typescript-eslint/no-shadow */
import mongoose from 'mongoose';
import { PaymentMethod } from '../../models/paymentMethod';
import { DocumentExistenceService } from '../isDocumentExist';
import * as error from 'http-errors';
import { Shop } from '../../models/shop';

export class PaymentMethodService {
    static add = (
        shopId: string,
        paymentMethodIds: string[]
    ): Promise<mongoose.Document | Error> =>
        new Promise<mongoose.Document | Error>(async (resolve, reject) => {
            try {
                if (!paymentMethodIds) {
                    reject(
                        error.NotAcceptable('No payment method(s) specified')
                    );
                }
                //check if the shop exists
                const shopExistence = new DocumentExistenceService(Shop);
                const isShopExist = shopExistence.byId(
                    shopId as unknown as mongoose.Types.ObjectId
                );

                if (!isShopExist) {
                    reject(error.Conflict(`The shop ${shopId} doesn't exist`));
                }

                // check if the payment method exists
                const paymentMethodExistence = new DocumentExistenceService(
                    PaymentMethod
                );

                await Promise.all(
                    paymentMethodIds.map(async (id) => {
                        const isPayMethExist =
                            await paymentMethodExistence.byId(
                                id as unknown as mongoose.Types.ObjectId
                            );

                        if (!isPayMethExist) {
                            reject(
                                error.Conflict(
                                    `The payment method ${id} doesn't exist`
                                )
                            );
                        }
                    })
                );

                const updated = await Shop.findByIdAndUpdate(
                    shopId,
                    {
                        $addToSet: {
                            paymentMethods: { $each: paymentMethodIds },
                        },
                    },
                    { new: true }
                );

                if (updated) {
                    resolve(updated);
                } else {
                    reject(
                        "Couldn't add the payment method (s) ! Please try again later"
                    );
                }
            } catch (error) {
                reject(error);
            }
        });

    static remove = (
        shopId: string,
        paymentMethodIds: string[]
    ): Promise<mongoose.Document | Error> =>
        new Promise<mongoose.Document | Error>(async (resolve, reject) => {
            try {
                if (!paymentMethodIds) {
                    reject(
                        error.NotAcceptable('No payment method(s) specified')
                    );
                }
                //check if the shop exists
                const shopExistence = new DocumentExistenceService(Shop);
                const isShopExist = shopExistence.byId(
                    shopId as unknown as mongoose.Types.ObjectId
                );

                if (!isShopExist) {
                    reject(error.Conflict(`The shop ${shopId} doesn't exist`));
                } else {
                    const updated = await Shop.findByIdAndUpdate(
                        shopId,
                        { $pullAll: { paymentMethods: paymentMethodIds } },
                        { new: true }
                    );

                    if (updated) {
                        resolve(updated);
                    } else {
                        reject(
                            "Couldn't remove the payment method (s) ! Please try again later"
                        );
                    }
                }
            } catch (error) {
                reject(error);
            }
        });
}
