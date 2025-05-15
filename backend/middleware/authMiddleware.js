
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; 
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!decoded.userId) {
                console.error('Error: "userId" is missing in JWT payload. Please ensure your token generation includes userId.');
                return res.status(401).json({ message: 'Not authorized, token payload invalid (missing userId)' });
            }

            const user = await User.findById(decoded.userId).select('-password'); 

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found in database (ID from token invalid)' });
            }
            
            // Pastikan req.user memiliki properti 'gmail'
            req.user = {
                id: user._id.toString(), 
                role: user.role,
                gmail: user.gmail 
            };

            next();

        } catch (error) {
            console.error('Not authorized, token failed:', error.message);
            return res.status(401).json({ message: `Not authorized, token failed: ${error.message}` });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role (${req.user?.role || 'none'}) is not authorized to access this route` });
        }
        next();
    };
};

