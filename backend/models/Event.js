const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Event description is required']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    time: {
        type: String,
        required: [true, 'Event time is required']
    },
    venue: {
        type: String,
        required: [true, 'Event venue is required']
    },
    category: {
        type: String,
        required: [true, 'Event category is required'],
        enum: {
            values: ['Academic', 'Cultural', 'Sports', 'Technical', 'Social', 'Other'],
            message: '{VALUE} is not a valid category'
        }
    },
    bannerUrl: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Event creator is required']
    }
}, { timestamps: true });

// Create indexes on createdBy, date, and category fields for better query performance
eventSchema.index({ createdBy: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.model('Event', eventSchema);
