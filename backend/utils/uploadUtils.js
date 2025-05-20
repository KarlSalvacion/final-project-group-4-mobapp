const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Upload files to Cloudinary
const uploadToCloudinary = async (files) => {
    const imageUrls = [];
    if (files && files.length > 0) {
        for (const file of files) {
            try {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({
                        resource_type: "auto",
                        chunk_size: 10000000, // 10MB chunks
                        upload_preset: 'mobile_upload',
                        transformation: [
                            { width: 800, height: 800, crop: "limit" },
                            { quality: "auto:low" },
                            { fetch_format: "auto" },
                            { flags: "attachment" }
                        ]
                    }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }).end(file.buffer);
                });
                imageUrls.push(result.secure_url);
            } catch (error) {
                throw new Error(`Failed to upload image: ${error.message}`);
            }
        }
    }
    return imageUrls;
};

// Delete images from Cloudinary
const deleteFromCloudinary = async (imageUrls) => {
    if (imageUrls && imageUrls.length > 0) {
        for (const imageUrl of imageUrls) {
            try {
                const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                throw new Error(`Failed to delete image: ${error.message}`);
            }
        }
    }
};

module.exports = {
    upload,
    uploadToCloudinary,
    deleteFromCloudinary
}; 