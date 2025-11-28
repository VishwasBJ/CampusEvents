const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validation');

// Validation rules for registration creation
const createRegistrationValidation = [
    body('eventId').trim().notEmpty().withMessage('Event ID is required')
];

// All registration routes are protected and require authentication

// POST /api/registrations - Register for an event
router.post('/', auth, createRegistrationValidation, validate, registrationController.registerForEvent);

// DELETE /api/registrations/:id - Cancel a registration
router.delete('/:id', auth, registrationController.cancelRegistration);

// GET /api/registrations/my-registrations - Get user's registrations
router.get('/my-registrations', auth, registrationController.getMyRegistrations);

// GET /api/registrations/event/:eventId - Get all registrations for a specific event
router.get('/event/:eventId', auth, registrationController.getEventRegistrations);

module.exports = router;
