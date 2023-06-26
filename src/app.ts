/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as http from 'http';
import { dbConnection } from './configs/database';
import * as dotenv from 'dotenv';
import * as httpError from 'http-errors';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { tokenGuard } from './middlewares/tokenGuard';

dotenv.config();

export default class App {
    app: express.Application = express();

    server: http.Server = http.createServer(this.app);

    public async init(): Promise<void> {
        this.middleWares();
        this.connectDb();
        this.routes();
        this.errorsHandlers();
    }

    private connectDb(): void {
        dbConnection(process.env.MONGO_URI);
    }

    private middleWares(): void {
        this.app.use(cors());
        this.app.use(morgan(':method :url :status :response-time ms'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    public baseRoute(req: express.Request, res: express.Response): void {
        res.json({
            message: 'Server is running',
        });
    }

    public routes(): void {
        this.app.get('/api', this.baseRoute);
        this.app.use('/api/auth/', authRouter);
        this.app.use(tokenGuard);
        this.app.use('/api/users/', userRouter);
    }

    private errorsHandlers(): void {
        this.app.use(
            (
                req: express.Request,
                res: express.Response,
                next: express.NextFunction
            ) => {
                next(new httpError.NotFound('URL not found'));
            }
        );

        this.app.use(
            (
                error: any,
                req: express.Request,
                res: express.Response,
                next: express.NextFunction
            ) => {
                res.status(error.status || 500);

                res.json(<IClientResponse>{
                    data: null,
                    message: error.message,
                    success: false,
                    error,
                });
            }
        );
    }
}
