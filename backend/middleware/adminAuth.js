const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    try {
        // Get the full user data from database
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. User not found.' 
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Admin privileges required.' 
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error in admin authentication' 
        });
    }
};

module.exports = adminAuth; 