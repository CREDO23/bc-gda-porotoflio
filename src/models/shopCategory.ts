import * as mongoose from 'mongoose';

const shopCategory = new mongoose.Schema({
    name: String,
    description: String,
});

export const ShopCategory = mongoose.model('shopCategories', shopCategory);
