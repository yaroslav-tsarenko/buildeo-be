require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const SECRET_KEY = process.env.SECRET_KEY;

const basicAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({message: 'No auth token provided'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('User not found for ID:', decoded.userId);
            return
            res.status(401).send({message: 'User not found'});
        }
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.redirect('/');
        } else {
            return res.redirect('/login');
        }
    }
};

module.exports = basicAuth;