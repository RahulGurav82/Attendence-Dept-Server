const jwt = require('jsonwebtoken');
const Department = require('../models/Department');

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get department from token
            const department = await Department.findById(decoded.id).select('-password');
            if (!department) {
                return res.status(401).json({ message: 'Not authorized to access this route' });
            }

            req.department = department;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
