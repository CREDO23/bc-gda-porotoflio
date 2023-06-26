import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const dbConnection = async (URI: string): Promise<void> => {
    try {
        await mongoose
            .connect(URI)
            .then(() => {
                console.log(`Database connection established`);
            })
            .catch((err) => console.log(err));
    } catch (error) {
        console.log(error);
    }
};
