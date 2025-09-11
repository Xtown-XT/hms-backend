// middlewares/verifyToken.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or malformed token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Debugging line to check token content
        req.user = decoded; // Attach decoded user to request
        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        next(); // Token is valid, proceed
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};