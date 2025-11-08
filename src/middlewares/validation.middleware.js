import { body, validationResult, param } from 'express-validator';
import mongoose from 'mongoose';

function validateResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const validateAddItem = [
    body('productId')
        .isString()
        .withMessage('Product ID must be a string')
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid Product ID format'),
    validateResult
];

const validateItem = [
    param('productId')
        .isString()
        .withMessage('Product ID must be a string')
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid Product ID format'),
    validateResult
];

export {
    validateAddItem,
    validateItem,
};