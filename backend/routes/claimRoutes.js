const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Listing = require('../models/Listing');
const { upload, uploadToCloudinary } = require('../utils/uploadUtils');
const { validateObjectId, validateOwnership, validateRequiredFields } = require('../middleware/validators');

// Get all claims for a user
router.get('/my-claims', async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.user.userId })
      .populate('listingId');
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching claims', error: error.message });
  }
});

// Create a new claim with proof images
router.post('/', upload.array('proofImages', 3), async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['listingId', 'description'];
    const validationError = validateRequiredFields(requiredFields, req.body);
    if (validationError) {
      return res.status(validationError.status).json({ message: validationError.error });
    }

    // Validate listing ID format
    if (!validateObjectId(req.body.listingId)) {
      return res.status(400).json({ 
        message: 'Invalid listing ID format',
        details: 'The provided listing ID is not in a valid format'
      });
    }

    // Check if listing exists and is active
    const listing = await Listing.findById(req.body.listingId);
    if (!listing) {
      return res.status(404).json({ 
        message: 'Listing not found',
        details: 'The listing you are trying to claim does not exist or has been removed'
      });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({
        message: 'Cannot claim this listing',
        details: `This listing is currently ${listing.status}`
      });
    }

    // Check if user is not claiming their own listing
    if (listing.userId.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot claim your own listing' });
    }

    // Check for existing pending claim
    const existingClaim = await Claim.findOne({
      listingId: req.body.listingId,
      userId: req.user.userId,
      status: 'pending'
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'You already have a pending claim for this item' });
    }

    // Upload proof images
    const imageUrls = await uploadToCloudinary(req.files, 'claims');

    // Create and save claim
    const claim = new Claim({
      ...req.body,
      userId: req.user.userId,
      status: 'pending',
      proofImages: imageUrls
    });

    await claim.save();
    res.status(201).json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ message: 'Error creating claim', error: error.message });
  }
});

// Update claim status (approve/reject)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Validate ownership of the listing
    const { error, item: listing } = await validateOwnership(Listing, claim.listingId, req.user.userId);
    if (error) {
      return res.status(error.status).json({ message: error.error });
    }

    claim.status = status;
    await claim.save();
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Error updating claim', error: error.message });
  }
});

module.exports = router; 