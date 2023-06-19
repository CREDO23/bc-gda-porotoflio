import * as mongoose from 'mongoose';

const userRole = new mongoose.Schema({
    name: String,
    description: String,
});

export const userRoleModel = mongoose.model('userRoles', userRole);
