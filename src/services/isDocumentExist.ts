/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

export class CheckDocumentExistence {
    model: mongoose.Model<any>;

    modelName: string;

    constructor(model: mongoose.Model<any>) {
        this.model = model;
        this.modelName = model.modelName.substring(
            0,
            model.modelName.length - 1
        );
    }

    byField = (field: string, value: string): Promise<string | boolean> =>
        new Promise<string | boolean>(async (resolve, reject) => {
            // check if the field exists
            const isFieldExist = await this.model.find({
                [field]: { $exists: true },
            });

            if (!isFieldExist.length) {
                reject(`Field ${field} does not exist on ${this.modelName} `);
            }

            const isExist = await this.model.find({
                [field]: {
                    $regex: new RegExp(value, 'i'),
                },
            });

            if (isExist[0]) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

    byId = (id: mongoose.Types.ObjectId): Promise<string | boolean> =>
        new Promise<string | boolean>(async (resolve, reject) => {
            if (mongoose.isValidObjectId(id)) {
                const isExist = await this.model.findById(id);

                if (isExist) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                reject(`"${id}" is not a valid id `);
            }
        });
}
