const ApiError = require('../utils/error.util');
const { globalHandlerMessage } = require('../languages');

// Handler Mongoose Error

// Xử lý ValidationError của mongoose
const handleValidationErrorDB = err => {
    const message = Object.keys(err.errors)
        .map(field => err.errors[field].message)
        .join('. ');
    return new ApiError(400, message);
};

const handleCastErrorDB = err => {
    return new ApiError(
        400,
        globalHandlerMessage.invalidField
            .replace('{{field}}', err.path)
            .replace('{{value}}', err.value),
    );
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    next();
}