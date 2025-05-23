const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Upload files to Cloudinary
const uploadToCloudinary = async (files) => {
    const imageUrls = [];
    if (!files || files.length === 0) {
        throw new Error('No files provided for upload');
    }

    for (const file of files) {
        try {
            console.log('Uploading file:', file.originalname);
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    resource_type: "auto",
                    chunk_size: 20000000, // 20MB chunks
                    transformation: [
                        { width: 1200, height: 1200, crop: "limit" },
                        { quality: "auto:good" },
                        { fetch_format: "auto" }
                    ]
                }, (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Upload successful:', result.secure_url);
                        resolve(result);
                    }
                }).end(file.buffer);
            });
            imageUrls.push(result.secure_url);
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error(`Failed to upload image ${file.originalname}: ${error.message}`);
        }
    }
    return imageUrls;
};

// Delete images from Cloudinary
const deleteFromCloudinary = async (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) {
        return;
    }

    for (const imageUrl of imageUrls) {
        try {
            console.log('Deleting image:', imageUrl);
            const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
            const result = await cloudinary.uploader.destroy(publicId);
            console.log('Delete result:', result);
        } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
            throw new Error(`Failed to delete image ${imageUrl}: ${error.message}`);
        }
    }
};

module.exports = {
    upload,
    uploadToCloudinary,
    deleteFromCloudinary
}; 