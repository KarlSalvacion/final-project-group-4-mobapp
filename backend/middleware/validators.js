const mongoose = require('mongoose');

const validateObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const validateOwnership = async (model, id, userId) => {
    const item = await model.findById(id);
    if (!item) {
        return { error: 'Item not found', status: 404 };
    }
    if (item.userId.toString() !== userId) {
        return { error: 'Not authorized to perform this action', status: 403 };
    }
    return { item };
};

const validateRequiredFields = (fields, data) => {
    const missing = [];
    for (const field of fields) {
        if (!data[field]) {
            missing.push(field);
        }
    }
    if (missing.length > 0) {
        return {
            error: `Missing required fields: ${missing.join(', ')}`,
            status: 400
        };
    }
    return null;
};

module.exports = {
    validateObjectId,
    validateOwnership,
    validateRequiredFields
}; 