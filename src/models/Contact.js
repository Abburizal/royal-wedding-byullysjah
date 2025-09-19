const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    weddingDate: {
        type: Date,
        required: false,
        validate: {
            validator: function(date) {
                return !date || date > new Date();
            },
            message: 'Wedding date must be in the future'
        }
    },
    package: {
        type: String,
        enum: ['basic', 'premium', 'luxury', 'custom'],
        required: false
    },
    guestCount: {
        type: String,
        required: false,
        validate: {
            validator: function(count) {
                return !count || /^\d+(-\d+)?$/.test(count);
            },
            message: 'Guest count must be a number or range (e.g., "50" or "50-100")'
        }
    },
    message: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'in-progress', 'completed', 'cancelled'],
        default: 'new'
    },
    source: {
        type: String,
        default: 'website'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    lastContactedAt: {
        type: Date,
        required: false
    },
    notes: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Index for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ submittedAt: -1 });
contactSchema.index({ status: 1 });

// Virtual for formatted wedding date
contactSchema.virtual('weddingDateFormatted').get(function() {
    return this.weddingDate ? this.weddingDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Not specified';
});

// Static method to get contacts by status
contactSchema.statics.getByStatus = function(status) {
    return this.find({ status }).sort({ submittedAt: -1 });
};

// Static method to get recent contacts
contactSchema.statics.getRecent = function(limit = 10) {
    return this.find().sort({ submittedAt: -1 }).limit(limit);
};

// Method to mark as contacted
contactSchema.methods.markAsContacted = function() {
    this.status = 'contacted';
    this.lastContactedAt = new Date();
    return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);