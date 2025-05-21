const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../config/auth');

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
                id: user._id,
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
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
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

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password (Note: In production, use proper password comparison)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
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

    // Log the user object for debugging
    console.log('Logged in user:', {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router; 