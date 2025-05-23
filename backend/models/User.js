const mongoose = require('mongoose');
const Listing = require('./Listing');
const Claim = require('./Claim');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    }
}, {
    timestamps: true
});

// Pre-save middleware to ensure role is set
userSchema.pre('save', async function(next) {
    if (!this.role) {
        this.role = 'user';
    }
    
    // If role is being changed to admin, delete all listings and claims
    if (this.isModified('role') && this.role === 'admin') {
        try {
            await Listing.deleteMany({ userId: this._id });
            await Claim.deleteMany({ userId: this._id });
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Pre-remove middleware to delete all listings and claims when user is deleted
userSchema.pre('findOneAndDelete', async function(next) {
    try {
        const user = await this.model.findOne(this.getQuery());
        if (user) {
            await Listing.deleteMany({ userId: user._id });
            await Claim.deleteMany({ userId: user._id });
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema); 