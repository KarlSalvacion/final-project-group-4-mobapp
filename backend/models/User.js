const mongoose = require('mongoose');

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
userSchema.pre('save', function(next) {
    if (!this.role) {
        this.role = 'user';
    }
    next();
});

module.exports = mongoose.model('User', userSchema); 