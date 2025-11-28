/**
 * Global error handling middleware
 * Catches and formats all errors with appropriate HTTP status codes
 * Handles MongoDB errors, JWT errors, and general errors
 */

const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        name: err.name
    });

    // Default error response
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Internal Server Error';
    let errors = null;

    // Handle MongoDB duplicate key error (E11000)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyPattern || {})[0];
        message = field 
            ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            : 'Duplicate field value entered';
        errors = [{
            field: field,
            message: message,
            type: 'duplicate'
        }];
    }

    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message,
            type: 'validation',
            value: error.value
        }));
    }

    // Handle MongoDB CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found`;
        errors = [{
            field: err.path,
            message: `Invalid ${err.path} format`,
            type: 'cast',
            value: err.value
        }];
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token, authorization denied';
        errors = [{
            type: 'jwt',
            message: 'Token is invalid or malformed'
        }];
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired, please login again';
        errors = [{
            type: 'jwt',
            message: 'Token has expired',
            expiredAt: err.expiredAt
        }];
    }

    // Handle MongoDB connection errors
    if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
        statusCode = 503;
        message = 'Database connection error';
        errors = [{
            type: 'database',
            message: 'Unable to connect to database'
        }];
    }

    // Send structured error response
    const response = {
        success: false,
        message: message
    };

    // Add errors array if exists
    if (errors) {
        response.errors = errors;
    }

    // Add error details in development mode
    if (process.env.NODE_ENV === 'development') {
        response.error = {
            name: err.name,
            stack: err.stack
        };
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
