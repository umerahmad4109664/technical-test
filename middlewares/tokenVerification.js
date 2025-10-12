const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('authorization');
    if (!token) { return res.status(401).json({ message: 'Unauthorized' }); }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) { return res.status(403).json({ message: err.message }); }
        req.user = user;
        next();
    });

}

module.exports = verifyToken;