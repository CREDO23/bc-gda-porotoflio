import * as mongoose from 'mongoose';

const paymentMethod = new mongoose.Schema({
    name: String,
    description: String,
});

export const PaymentMethod = mongoose.model('paymentMethods', paymentMethod);
