const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Register for event (protected) - verify event exists, check user is not creator, check no duplicate registration, create registration
exports.registerForEvent = async (req, res, next) => {
    try {
        const { eventId } = req.body;

        // Validate eventId is provided
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        // Verify event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check user is not the creator
        if (event.createdBy.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot register for your own event'
            });
        }

        // Check for duplicate registration
        const existingRegistration = await Registration.findOne({
            event: eventId,
            user: req.user.id
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        // Create registration
        const registration = new Registration({
            event: eventId,
            user: req.user.id
        });

        await registration.save();

        // Populate event and user details before returning
        await registration.populate('event');
        await registration.populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: 'Successfully registered for event',
            registration
        });
    } catch (err) {
        console.error('Register for event error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        next(err);
    }
};

// Cancel registration (protected) - verify registration ownership, delete registration
exports.cancelRegistration = async (req, res, next) => {
    try {
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        // Verify registration ownership
        if (registration.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this registration'
            });
        }

        // Delete registration
        await Registration.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Registration cancelled successfully'
        });
    } catch (err) {
        console.error('Cancel registration error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }
        next(err);
    }
};

// Get my registrations (protected) - fetch registrations for authenticated user with event population
exports.getMyRegistrations = async (req, res, next) => {
    try {
        const registrations = await Registration.find({ user: req.user.id })
            .populate('event')
            .populate('user', 'name email')
            .sort({ registeredAt: -1 }); // Sort by registration date descending

        res.json({
            success: true,
            count: registrations.length,
            registrations
        });
    } catch (err) {
        console.error('Get my registrations error:', err.message);
        next(err);
    }
};

// Get event registrations (protected) - fetch all registrations for specific event
exports.getEventRegistrations = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        // Verify event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Fetch all registrations for the event
        const registrations = await Registration.find({ event: eventId })
            .populate('user', 'name email')
            .sort({ registeredAt: 1 }); // Sort by registration date ascending

        res.json({
            success: true,
            count: registrations.length,
            registrations
        });
    } catch (err) {
        console.error('Get event registrations error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        next(err);
    }
};
