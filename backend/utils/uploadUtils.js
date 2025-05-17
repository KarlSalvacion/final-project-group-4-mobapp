const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload files to Cloudinary
const uploadToCloudinary = async (files, folder) => {
    const imageUrls = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    folder,
                    resource_type: 'auto'
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(file.buffer);
            });
            imageUrls.push(result.secure_url);
        }
    }
    return imageUrls;
};

// Delete images from Cloudinary
const deleteFromCloudinary = async (imageUrls) => {
    if (imageUrls && imageUrls.length > 0) {
        for (const imageUrl of imageUrls) {
            const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
    }
};

module.exports = {
    upload,
    uploadToCloudinary,
    deleteFromCloudinary
}; 