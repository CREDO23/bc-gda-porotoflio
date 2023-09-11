import mongoose from 'mongoose';
import { PaymentMethod } from '../../models/paymentMethod';
import { DocumentExistenceService } from '../isDocumentExist';
import * as error from 'http-errors';
import { Shop } from '../../models/shop';

export class PaymentMethodService {
    static add = (
        shopId: string,
        paymentMethodId: string
    ): Promise<mongoose.Document | Error> =>
        new Promise<mongoose.Document | Error>(async (resolve, reject) => {
            //check if the shop exists
            const shopExistence = new DocumentExistenceService(Shop);
            const isShopExist = shopExistence.byId(
                shopId as unknown as mongoose.Types.ObjectId
            );

            // check if the payment method exists
            const paymentMethodExistence = new DocumentExistenceService(
                PaymentMethod
            );
            const isPayMethExist = await paymentMethodExistence.byId(
                paymentMethodId as unknown as mongoose.Types.ObjectId
            );

            if (!isShopExist) {
                reject(error.Conflict(`The shop ${shopId} doesn't exist`));
            }

            if (!isPayMethExist) {
                reject(
                    error.Conflict(
                        `The payment method ${paymentMethodId} doesn't exist`
                    )
                );
            }

            const updated = await Shop.findByIdAndUpdate(
                shopId,
                { $addToSet: { paymentMethods: paymentMethodId } },
                { new: true }
            );

            if (updated) {
                resolve(updated);
            } else {
                reject(
                    "Couldn't add the payment method ! Please try again later"
                );
            }
        });

    static remove = (
        shopId: string,
        paymentMethodId: string
    ): Promise<mongoose.Document | Error> =>
        new Promise<mongoose.Document | Error>(async (resolve, reject) => {
            //check if the shop exists
            const shopExistence = new DocumentExistenceService(Shop);
            const isShopExist = shopExistence.byId(
                shopId as unknown as mongoose.Types.ObjectId
            );

            if (isShopExist) {
                reject(error.Conflict(`The shop ${shopId} doesn't exist`));
            } else {
                const updated = await Shop.findByIdAndUpdate(
                    shopId,
                    { $pull: { paymentMethods: paymentMethodId } },
                    { new: true }
                );

                if (updated) {
                    resolve(updated);
                } else {
                    reject(
                        "Couldn't remove the payment method ! Please try again later"
                    );
                }
            }
        });
}
