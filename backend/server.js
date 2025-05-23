const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const claimRoutes = require('./routes/claimRoutes');
const adminRoutes = require('./routes/admin');
const { authenticateToken } = require('./middleware/auth');
const dbConfig = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MongoDB Connection
mongoose.connect(dbConfig.mongoURI, dbConfig.options)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/users', (req, res, next) => {
  // Skip authentication for login, register, and check-token routes
  if (req.path === '/login' || req.path === '/register' || req.path === '/check-token') {
    return next();
  }
  // Apply authentication middleware for all other routes
  authenticateToken(req, res, next);
}, userRoutes);
app.use('/api/listings', authenticateToken, listingRoutes);
app.use('/api/claims', authenticateToken, claimRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// 404 handler
app.use((req, res, next) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Request URL:', req.url);
  console.error('Request Method:', req.method);
  console.error('Request Headers:', req.headers);
  
  // Handle specific error types
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired', error: err.message });
  }
  
  // Default error response
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    path: req.url
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});