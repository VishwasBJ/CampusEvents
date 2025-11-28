const { validationResult } = require('express-validator');

/**
 * Validation middleware to check express-validator results
 * This middleware should be used after validation rules in routes
 * It will automatically return 400 with validation errors if validation fails
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg,
                value: err.value,
                type: 'validation'
            }))
        });
    }
    
    next();
};

module.exports = validate;
