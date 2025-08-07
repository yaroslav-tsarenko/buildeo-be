const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/sendEmail");
const JWT_SECRET = process.env.SECRET_KEY;

const register = async (req, res) => {
    const {firstName, lastName, email, city, street, postNumber, phoneNumber, longitude, password, role} = req.body;
    console.log("user role is ", role)
    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({error: 'User already exists'});
        }

        user = new User({
            firstName,
            lastName,
            email,
            city,
            street,
            postNumber,
            phoneNumber,
            longitude,
            password,
            role
        });

        await user.save();
        sendEmail(email, 'Welcome to Buildeo!', `Hello ${firstName}, welcome to Buildeo! Hope you enjoy our services.`);
        res.status(201).json({message: 'User created successfully', user});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Server error'});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log('User logging in:', req.body);
        const user = await User.findOne({email});

        if (!user) {
            console.error('User not found:', email);
            return res.status(400).json({error: 'Invalid credentials'});
        }

        if (password !== user.password) {
            console.error('Password does not match for user:', email);
            return res.status(400).json({error: 'Invalid credentials'});
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '7d'});
        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUser = await User.findById(decoded.userId);

        if (!currentUser) {
            return res.status(400).json({error: 'User not found'});
        }

        res.status(201).json({message: 'User logged in successfully', token});
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    register,
    login
};