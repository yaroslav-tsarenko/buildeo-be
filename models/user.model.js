const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    longitude: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['buyer', 'seller'] },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;