import * as joi from 'joi';

export class JOIPaymentMethodValidation {
    static create = joi.object({
        name: joi.string().required(),
        description: joi.string(),
    });

    static update = joi.object({
        name: joi.string(),
        description: joi.string(),
    });
}
