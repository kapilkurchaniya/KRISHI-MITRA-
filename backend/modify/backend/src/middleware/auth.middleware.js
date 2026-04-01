const userModel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');

async function authuser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    const blacklistedToken = await blacklistModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }
        req.user = user;
        next();
    } 
    catch (error) {
        res.status(401).json({ message: 'Unauthorized credential' });
    }   
}

module.exports = {authuser} ;