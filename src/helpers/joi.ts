import * as joi from 'joi';

export class JOIUserValidation {
    static register = joi.object({
        username: joi.string().required(),
        email: joi.string().required().email(),
        password: joi.string().required(),
        phoneNumber: joi.string(),
    });

    static login = joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
    });

    static update = joi.object({
        password: joi.string(),
        phoneNumber: joi.string(),
        firstname: joi.string(),
        lastname: joi.string(),
        country: joi.string(),
        city: joi.string(),
        roles: joi.array(),
        adress_line1: joi.string(),
        adress_line2: joi.string(),
    });
}
