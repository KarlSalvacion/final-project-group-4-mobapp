const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');

  if (!token) {
    console.error('No token provided in request');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    console.log('Verifying token with secret:', authConfig.JWT_SECRET);
    const verified = jwt.verify(token, authConfig.JWT_SECRET);
    console.log('Token verified successfully:', verified);
    req.user = verified;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(400).json({ 
      message: 'Invalid token',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { authenticateToken }; 