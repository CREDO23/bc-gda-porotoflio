/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import { DocumentExistenceService } from '../isDocumentExist';
import * as error from 'http-errors';
import { Shop } from '../../models/shop';

export class ImageGalleryService {
    // private model: mongoose.Model<IShop>; add priduct model mongoose.Model<IShop | IProduct>

    static add = (
        shopId: string,
        imgUrls: string[]
    ): Promise<mongoose.Document | Error> =>
        new Promise<mongoose.Document | Error>(async (resolve, reject) => {
            try {
                if (!imgUrls.length) {
                    reject(error.NotAcceptable('No image(s) specified'));
                }
                //check if the shop exists
                const shopExistence = new DocumentExistenceService(Shop);
                const isShopExist = shopExistence.byId(
                    shopId as unknown as mongoose.Types.ObjectId
                );

                if (!isShopExist) {
                    reject(error.Conflict(`The shop ${shopId} doesn't exist`));
                }

                const updated = await Shop.findByIdAndUpdate(
                    shopId,
                    { $addToSet: { gallery: { $each: imgUrls } } },
                    { new: true }
                );

                if (updated) {
                    resolve(updated);
                } else {
                    reject("Couldn't add the images ! Please try again later");
                }
            } catch (error) {
                reject(error);
            }
        });

    static remove = (
        shopId: string,
        imgUrls: string[]
    ): Promise<mongoose.Document | Error> =>
        new Promise<mongoose.Document | Error>(async (resolve, reject) => {
            try {
                if (!imgUrls.length) {
                    reject(error.NotAcceptable('No image(s) specified'));
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
                        { $pullAll: { gallery: imgUrls } },
                        { new: true }
                    );

                    if (updated) {
                        resolve(updated);
                    } else {
                        reject(
                            "Couldn't remove the image(s) ! Please try again later"
                        );
                    }
                }
            } catch (error) {
                reject(error);
            }
        });
}
