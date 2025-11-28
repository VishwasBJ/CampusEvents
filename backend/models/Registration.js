const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event reference is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound unique index on (event, user) to prevent duplicate registrations
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

// Create indexes on user and event fields for better query performance
registrationSchema.index({ user: 1 });
registrationSchema.index({ event: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
