const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) throw new Error('Unauthorized');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {};
        req.user.role = decoded.role;
        req.user.username = decoded.username;
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    }
}