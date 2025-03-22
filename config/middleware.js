const jwt = require('jsonwebtoken');
const cleSecret = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0!';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('Authorization header manquant' );
        return res.status(401).json({ message: 'Authorization header manquant' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('Token manquant');
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, cleSecret);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('Token invalide ou expiré');
        res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

module.exports = authMiddleware;
