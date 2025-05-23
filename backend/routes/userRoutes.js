const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../config/auth');
const Listing = require('../models/Listing');
const Claim = require('../models/Claim');

// Debug route to check token
router.get('/check-token', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, authConfig.JWT_SECRET);
        
        // Get full user data
        const user = await User.findById(decoded.userId);
        
        res.json({
            tokenContents: decoded,
            userData: {
                _id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Invalid token', error: error.message });
    }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with explicit role setting
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password; // Note: In production, hash the password before saving
    user.name = name;
    
    // Explicitly set role if provided
    if (role === 'admin') {
      user.role = 'admin';
    }

    // Save the user
    await user.save();

    // Create token with role
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role 
      },
      authConfig.JWT_SECRET,
      { expiresIn: authConfig.JWT_EXPIRES_IN }
    );

    // Log the user object for debugging
    console.log('Created user:', {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.status(201).json({ 
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password (Note: In production, use proper password comparison)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create token with role
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role 
      },
      authConfig.JWT_SECRET,
      { expiresIn: authConfig.JWT_EXPIRES_IN }
    );

    res.json({ 
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'An error occurred during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete user account
router.delete('/delete-account', async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find and delete the user
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all user's listings
        await Listing.deleteMany({ userId: req.user.userId });

        // Delete all user's claims
        await Claim.deleteMany({ userId: req.user.userId });

        // Delete the user
        await User.findByIdAndDelete(req.user.userId);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
});

module.exports = router; 