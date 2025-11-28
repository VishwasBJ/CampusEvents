const jwt = require('jsonwebtoken');

// JWT authentication middleware for protected routes
module.exports = function (req, res, next) {
    // Extract token from Authorization header (Bearer token format)
    const authHeader = req.header('Authorization');
    
    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ 
            success: false,
            message: 'No token provided, authorization denied' 
        });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

    // Check if token exists after extraction
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'No token provided, authorization denied' 
        });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user ID to request object after successful verification
        req.user = decoded.user;
        
        // Continue to next middleware/route handler
        next();
    } catch (err) {
        // Handle invalid/expired token errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token has expired, please login again' 
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token, authorization denied' 
            });
        } else {
            return res.status(401).json({ 
                success: false,
                message: 'Token verification failed' 
            });
        }
    }
};
