/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import * as error from 'http-errors';

export class DocumentGetterService<MType> {
    model: mongoose.Model<MType>;

    modelName: string;

    query: mongoose.FilterQuery<MType> = {};

    constructor(model: mongoose.Model<MType>) {
        this.model = model;
        this.modelName = model.modelName;
    }

    queryFilter = (query: mongoose.FilterQuery<MType>) => {
        this.query = query;
    };

    byId = (id: string): Promise<MType | Error> =>
        new Promise<MType | Error>(async (resolve, reject) => {
            try {
                if (mongoose.isValidObjectId(id)) {
                    const document: MType = await this.model.findById(id);

                    if (document) {
                        resolve(document);
                    } else {
                        reject(
                            error.NotFound(
                                `The ${this.modelName} ${id} is not found`
                            )
                        );
                    }
                } else {
                    reject(error.NotAcceptable(`"${id}" is not a valid id`));
                }
            } catch (error) {
                reject(error);
            }
        });

    one = (): Promise<MType | Error> =>
        new Promise<MType | Error>(async (resolve, reject) => {
            try {
                const document: MType = await this.model.findOne(this.query);

                if (document) {
                    resolve(document);
                } else {
                    reject(
                        error.NotFound(
                            `A ${this.modelName} with ${JSON.stringify(
                                this.query
                            )} does not exist`
                        )
                    );
                }
            } catch (error) {
                reject(error);
            }
        });

    all = (): Promise<MType[] | string> =>
        new Promise<MType[] | string>(async (resolve, reject) => {
            try {
                const documents = await this.model.find(this.query);

                if (documents) {
                    resolve(documents);
                } else {
                    reject(
                        error.NotFound(
                            `${this.modelName}s with ${JSON.stringify(
                                this.query
                            )} do not exist`
                        )
                    );
                }
            } catch (error) {
                reject(error);
            }
        });
}
