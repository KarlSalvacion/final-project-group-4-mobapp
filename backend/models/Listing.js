const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['lost', 'found']
    },
    category: {
        type: String,
        required: true,
        enum: ['clothes', 'electronics', 'accessories', 'documents', 'books', 'jewelry', 'bags', 'other']
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Time must be in HH:MM format'
        }
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: function(images) {
                return images.length > 0 && images.length <= 5;
            },
            message: 'Must provide at least 1 image and no more than 5 images'
        }
    },
    status: {
        type: String,
        enum: ['active', 'claimed', 'closed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update the updatedAt timestamp before saving
listingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Listing', listingSchema); 