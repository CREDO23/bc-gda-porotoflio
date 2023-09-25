/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import * as error from 'http-errors';

export class DocumentExistenceService<MType> {
    model: mongoose.Model<MType>;

    modelName: string;

    constructor(model: mongoose.Model<MType>) {
        this.model = model;
        this.modelName = model.modelName.substring(
            0,
            model.modelName.length - 1
        );
    }

    byId = (id: mongoose.Types.ObjectId): Promise<string | boolean> =>
        new Promise<string | boolean>(async (resolve, reject) => {
            try {
                if (mongoose.isValidObjectId(id)) {
                    const isExist = await this.model.findById(id);

                    if (isExist) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    reject(error.NotAcceptable(`"${id}" is not a valid id `));
                }
            } catch (error) {
                reject(error);
            }
        });

    withQuery = (
        query: mongoose.FilterQuery<MType>
    ): Promise<string | boolean> =>
        new Promise<string | boolean>(async (resolve, reject) => {
            try {
                const isExist = await this.model.findOne(query);

                if (isExist) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                reject(error);
            }
        });
}
