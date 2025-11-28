const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register controller
exports.register = async (req, res, next) => {
    try {
        console.log('Register request received:', { name: req.body.name, email: req.body.email });
        const { name, email, password } = req.body;

        // Check if user already exists (duplicate email)
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ 
                success: false,
                message: 'User with this email already exists' 
            });
        }

        // Create new user (password will be hashed by pre-save hook)
        user = new User({
            name,
            email,
            passwordHash: password // Will be hashed by pre-save hook
        });

        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user._id,
                email: user.email
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response with token and user data
        console.log('Registration successful, sending response');
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            token,
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error('Register error:', err.message);
        next(err);
    }
};

// Login controller
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Verify password (compare password hash)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user._id,
                email: user.email
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return JWT token and user data
        res.json({ 
            success: true,
            message: 'Login successful',
            token,
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        next(err);
    }
};

// Get profile controller - fetch authenticated user's profile
exports.getProfile = async (req, res, next) => {
    try {
        // Extract user ID from JWT (added by auth middleware)
        const userId = req.user.id;

        // Fetch user from database (exclude passwordHash and salt)
        const user = await User.findById(userId).select('-passwordHash -salt');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Return user profile data
        res.json({ 
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        console.error('Get profile error:', err.message);
        next(err);
    }
};

// Update profile controller - update user name and email
exports.updateProfile = async (req, res, next) => {
    try {
        // Extract user ID from JWT (added by auth middleware)
        const userId = req.user.id;
        const { name, email } = req.body;

        // Fetch current user
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Check if email is being changed and if new email already exists
        if (email && email.toLowerCase() !== user.email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Email already in use by another account' 
                });
            }
            user.email = email.toLowerCase();
        }

        // Update name if provided
        if (name) {
            user.name = name;
        }

        // Save updated user (updatedAt timestamp will be updated automatically)
        await user.save();

        // Return updated user profile
        res.json({ 
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        console.error('Update profile error:', err.message);
        next(err);
    }
};
