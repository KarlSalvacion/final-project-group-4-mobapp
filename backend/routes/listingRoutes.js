const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../utils/uploadUtils');
const { validateOwnership, validateRequiredFields } = require('../middleware/validators');

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
});

// Create a new listing with image upload
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received files:', req.files);

    // Validate required fields
    const requiredFields = ['title', 'description', 'type', 'category', 'location', 'date', 'time'];
    const validationError = validateRequiredFields(requiredFields, req.body);
    if (validationError) {
      return res.status(validationError.status).json({ message: validationError.error });
    }

    // Validate type and category values
    const validTypes = ['lost', 'found'];
    const validCategories = ['clothes', 'electronics', 'accessories', 'documents', 'books', 'jewelry', 'bags', 'other'];
    
    if (!validTypes.includes(req.body.type)) {
      return res.status(400).json({ message: 'Invalid type. Must be either "lost" or "found"' });
    }
    
    if (!validCategories.includes(req.body.category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Upload images
    let imageUrls;
    try {
      imageUrls = await uploadToCloudinary(req.files);
    } catch (error) {
      console.error('Error uploading images:', error);
      return res.status(500).json({ message: 'Error uploading images', error: error.message });
    }

    // Create new listing
    const listing = new Listing({
      ...req.body,
      userId: req.user.userId,
      images: imageUrls,
      status: 'active'
    });

    // Save listing
    try {
      const savedListing = await listing.save();
      console.log('Saved listing:', savedListing);
      res.status(201).json(savedListing);
    } catch (error) {
      console.error('Error saving listing:', error);
      // If saving fails, delete uploaded images
      await deleteFromCloudinary(imageUrls);
      res.status(500).json({ message: 'Error saving listing', error: error.message });
    }
  } catch (error) {
    console.error('Error in create listing route:', error);
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
});

// Get a specific listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listing', error: error.message });
  }
});

// Update a listing
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    // Validate ownership
    const { error, item: listing } = await validateOwnership(Listing, req.params.id, req.user.userId);
    if (error) {
      return res.status(error.status).json({ message: error.error });
    }

    // Validate type and category if they are being updated
    if (req.body.type) {
      const validTypes = ['lost', 'found'];
      if (!validTypes.includes(req.body.type)) {
        return res.status(400).json({ message: 'Invalid type. Must be either "lost" or "found"' });
      }
    }

    if (req.body.category) {
      const validCategories = ['clothes', 'electronics', 'accessories', 'documents', 'books', 'jewelry', 'bags', 'other'];
      if (!validCategories.includes(req.body.category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    // Handle new image uploads if any
    if (req.files && req.files.length > 0) {
      const imageUrls = await uploadToCloudinary(req.files);
      req.body.images = imageUrls;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
});

// Delete a listing
router.delete('/:id', async (req, res) => {
  try {
    // Validate ownership
    const { error, item: listing } = await validateOwnership(Listing, req.params.id, req.user.userId);
    if (error) {
      return res.status(error.status).json({ message: error.error });
    }

    // Delete images from Cloudinary
    await deleteFromCloudinary(listing.images);

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
});

module.exports = router; 