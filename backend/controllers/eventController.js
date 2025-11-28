const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Get all events (public) - fetch all events with creator population
exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find()
            .populate('createdBy', 'name email')
            .sort({ date: 1 }); // Sort by date ascending
        
        res.json({
            success: true,
            count: events.length,
            events
        });
    } catch (err) {
        console.error('Get all events error:', err.message);
        next(err);
    }
};

// Get event by ID (public) - fetch single event with creator details
exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name email');
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        res.json({
            success: true,
            event
        });
    } catch (err) {
        console.error('Get event by ID error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        next(err);
    }
};

// Create event (protected) - validate input, set createdBy from JWT, create event
exports.createEvent = async (req, res, next) => {
    try {
        const { title, description, date, time, venue, category, bannerUrl } = req.body;

        // Create new event with createdBy set from JWT
        const event = new Event({
            title,
            description,
            date,
            time,
            venue,
            category,
            bannerUrl: bannerUrl || '',
            createdBy: req.user.id // Set from JWT middleware
        });

        await event.save();

        // Populate creator details before returning
        await event.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event
        });
    } catch (err) {
        console.error('Create event error:', err.message);
        next(err);
    }
};

// Update event (protected) - verify ownership, update event
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Verify ownership (createdBy matches user)
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        // Update event fields
        const { title, description, date, time, venue, category, bannerUrl } = req.body;
        
        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (date !== undefined) event.date = date;
        if (time !== undefined) event.time = time;
        if (venue !== undefined) event.venue = venue;
        if (category !== undefined) event.category = category;
        if (bannerUrl !== undefined) event.bannerUrl = bannerUrl;

        await event.save();

        // Populate creator details before returning
        await event.populate('createdBy', 'name email');

        res.json({
            success: true,
            message: 'Event updated successfully',
            event
        });
    } catch (err) {
        console.error('Update event error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        next(err);
    }
};

// Delete event (protected) - verify ownership, delete event and cascade delete registrations
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Verify ownership (createdBy matches user)
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }

        // Delete the event
        await Event.findByIdAndDelete(req.params.id);

        // Cascade delete registrations associated with this event
        await Registration.deleteMany({ event: req.params.id });

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (err) {
        console.error('Delete event error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        next(err);
    }
};

// Get my events (protected) - fetch events where createdBy matches authenticated user
exports.getMyEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ createdBy: req.user.id })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 }); // Sort by creation date descending
        
        res.json({
            success: true,
            count: events.length,
            events
        });
    } catch (err) {
        console.error('Get my events error:', err.message);
        next(err);
    }
};
