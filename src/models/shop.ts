import * as mongoose from 'mongoose';

const shopModel = new mongoose.Schema<IShop>({
    id: mongoose.Types.ObjectId,
    shopName: String,
    shopCategory: mongoose.Types.ObjectId,
    description: String,
    owner: mongoose.Types.ObjectId,
    paymentMethods: [mongoose.Types.ObjectId],
    products: [mongoose.Types.ObjectId],
    imageUrl: String,
    gallery: [String],
});

export const Shop = mongoose.model('shops', shopModel);