const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    nama: {
        type: String,
        required: [true, 'Nama is required'],
        trim: true,
        maxlength: [100, 'Nama cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    wedding_date: {
        type: Date,
        required: [true, 'Wedding date is required'],
        validate: {
            validator: function(date) {
                return date > new Date();
            },
            message: 'Wedding date must be in the future'
        }
    },
    package: {
        type: String,
        required: [true, 'Package selection is required'],
        enum: {
            values: ['basic', 'premium', 'luxury', 'custom'],
            message: 'Package must be one of: basic, premium, luxury, custom'
        }
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    budget: {
        type: String,
        enum: ['under-50jt', '50jt-100jt', '100jt-200jt', 'above-200jt', 'discuss'],
        default: 'discuss'
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'quoted', 'booked', 'completed', 'cancelled'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    follow_up_date: {
        type: Date
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for efficient queries
InquirySchema.index({ email: 1 });
InquirySchema.index({ wedding_date: 1 });
InquirySchema.index({ status: 1 });
InquirySchema.index({ created_at: -1 });

// Virtual for formatted wedding date
InquirySchema.virtual('wedding_date_formatted').get(function() {
    return this.wedding_date ? this.wedding_date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';
});

// Virtual for days until wedding
InquirySchema.virtual('days_until_wedding').get(function() {
    if (!this.wedding_date) return null;
    const today = new Date();
    const weddingDate = new Date(this.wedding_date);
    const diffTime = weddingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Method to check if follow-up is needed
InquirySchema.methods.needsFollowUp = function() {
    if (!this.follow_up_date) return false;
    return new Date() >= this.follow_up_date;
};

// Static method to get inquiries by status
InquirySchema.statics.getByStatus = function(status) {
    return this.find({ status }).sort({ created_at: -1 });
};

// Static method to get recent inquiries
InquirySchema.statics.getRecent = function(limit = 10) {
    return this.find().sort({ created_at: -1 }).limit(limit);
};

// Pre-save middleware to update the updated_at field
InquirySchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Inquiry', InquirySchema);