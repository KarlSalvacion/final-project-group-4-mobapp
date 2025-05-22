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

// Update listing status
router.put('/listings/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['active', 'claimed', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status. Must be one of: active, claimed, closed' 
            });
        }

        const listing = await Listing.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId', 'name email');

        if (!listing) {
            return res.status(404).json({ 
                success: false, 
                message: 'Listing not found' 
            });
        }

        res.json({ success: true, listing });
    } catch (error) {
        console.error('Error updating listing status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating listing status',
            error: error.message 
        });
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
        const userId = req.params.id;

        console.log('Role update request:', {
            userId,
            requestedRole: role,
            currentUser: req.user.userId
        });

        // Prevent self-modification
        if (userId === req.user.userId) {
            console.log('Attempted self-modification');
            return res.status(400).json({ 
                success: false, 
                message: 'You cannot modify your own role' 
            });
        }

        // Validate role
        if (!role || !['user', 'admin'].includes(role)) {
            console.log('Invalid role provided:', role);
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid role. Must be either "user" or "admin"' 
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        console.log('Found user:', {
            userId: user._id,
            currentRole: user.role,
            requestedRole: role
        });

        // Update user role
        user.role = role;
        try {
            await user.save();
            console.log('Successfully updated user role');
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            throw saveError;
        }

        // Return updated user without password
        const updatedUser = await User.findById(userId).select('-password');
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating user role:', {
            error: error.message,
            stack: error.stack,
            userId: req.params.id,
            role: req.body.role
        });
        res.status(500).json({ 
            success: false, 
            message: `Error updating user role: ${error.message}`,
            error: error.message 
        });
    }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const userId = req.params.id;

        // Prevent self-deletion
        if (userId === req.user.userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'You cannot delete your own account' 
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Delete user
        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting user',
            error: error.message 
        });
    }
});

module.exports = router; 