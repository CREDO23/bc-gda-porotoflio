import transporter from '../../configs/nodemailer';
import * as nodemailer from 'nodemailer';
import type { TemplateOptions } from 'nodemailer-express-handlebars';

export class MailHelper {
    template: string;

    constructor(template: string) {
        this.template = template;
    }

    send = (
        receiver: IUser,
        subject: string,
        context: object
    ): Promise<string | nodemailer.SentMessageInfo> =>
        new Promise<string | nodemailer.SentMessageInfo>((resolve, reject) => {
            const options: nodemailer.SendMailOptions & TemplateOptions = {
                from: process.env.NODEMAILER_EMAIL,
                subject: subject,
                to: receiver.email,
                template: this.template,
                context: {
                    ...context,
                },
            };

            transporter.sendMail(options, (error, result) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(result);
                }
            });
        });
}
