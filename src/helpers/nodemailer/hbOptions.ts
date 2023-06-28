import * as path from 'path';
import type { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars';

const hbOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
        partialsDir: path.resolve(__dirname + '/views/'),
        defaultLayout: '',
    },
    viewPath: path.resolve(__dirname + '/views/'),
};

export default hbOptions;
