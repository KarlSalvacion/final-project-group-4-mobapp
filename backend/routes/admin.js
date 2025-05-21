const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Listing = require('../models/Listing');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// Get all claims
router.get('/claims', adminAuth, async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate('userId', 'name email')
            .populate('listingId')
            .sort({ createdAt: -1 });
        res.json({ success: true, claims });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching claims' });
    }
});

// Update claim status
router.put('/claims/:id', adminAuth, async (req, res) => {
    try {
        const { status, notes } = req.body;
        const claim = await Claim.findByIdAndUpdate(
            req.params.id,
            {
                status,
                notes,
                approvedBy: req.user._id
            },
            { new: true }
        ).populate('userId', 'name email')
         .populate('listingId');
        res.json({ success: true, claim });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating claim' });
    }
});

// Get all listings
router.get('/listings', adminAuth, async (req, res) => {
    try {
        const listings = await Listing.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching listings' });
    }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

// Update user role
router.put('/users/:id/role', adminAuth, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user role' });
    }
});

module.exports = router; 