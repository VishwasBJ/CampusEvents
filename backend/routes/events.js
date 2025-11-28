const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validation');

// Validation rules for event creation (all fields required)
const createEventValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Invalid date format'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('category').trim().notEmpty().withMessage('Category is required')
        .isIn(['Academic', 'Cultural', 'Sports', 'Technical', 'Social', 'Other'])
        .withMessage('Invalid category'),
    body('bannerUrl').optional().trim()
];

// Validation rules for event update (all fields optional)
const updateEventValidation = [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('date').optional().notEmpty().withMessage('Date cannot be empty').isISO8601().withMessage('Invalid date format'),
    body('time').optional().trim().notEmpty().withMessage('Time cannot be empty'),
    body('venue').optional().trim().notEmpty().withMessage('Venue cannot be empty'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty')
        .isIn(['Academic', 'Cultural', 'Sports', 'Technical', 'Social', 'Other'])
        .withMessage('Invalid category'),
    body('bannerUrl').optional().trim()
];

// Public routes
router.get('/', eventController.getAllEvents);

// Protected routes - require authentication
router.get('/my-events', auth, eventController.getMyEvents);
router.post('/', auth, createEventValidation, validate, eventController.createEvent);

// Public and protected routes with :id parameter (must come after specific routes)
router.get('/:id', eventController.getEventById);
router.put('/:id', auth, updateEventValidation, validate, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

module.exports = router;
