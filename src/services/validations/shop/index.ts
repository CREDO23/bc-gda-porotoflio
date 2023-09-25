import * as joi from 'joi';

export class JOIShopValidation {
    static create = joi.object({
        name: joi.string().required(),
        category: joi.string().required(),
        description: joi.string(),
        image: joi.string(),
        gallery: joi.array().items(joi.string()),
        paymentMethods: joi.array().items(joi.string()).required(),
        products: joi.array().items(joi.string()),
        status: joi
            .string()
            .valid('CREATED', 'PUBLISHED')
            .required()
            .default('CREATED'),
    });

    static update = joi.object({
        shopName: joi.string(),
        shopCategory: joi.string(),
        description: joi.string(),
        imageUrl: joi.string(),
        status: joi.string().valid('CREATED', 'PUBLISHED'),
    });

    static paymentMethod = joi.object({
        paymentMethodIds: joi.array().items(joi.string()),
    });

    static gallery = joi.object({ images: joi.array().items(joi.string()) });

    static products = joi.object({ products: joi.array().items(joi.string()) });
}
