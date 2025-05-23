const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    description: {
        type: String,
        required: true
    },
    proofImages: {
        type: [String],
        default: [],
        validate: {
            validator: function(images) {
                return images.length <= 3;
            },
            message: 'Cannot upload more than 3 proof images'
        }
    },
    type: {
        type: String,
        enum: ['claim', 'found'],
        default: 'claim'
    },
    notes: String,
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Update the updatedAt timestamp before saving
claimSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Claim', claimSchema); 