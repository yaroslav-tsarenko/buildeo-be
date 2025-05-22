const User = require('../models/user.model');
const {uploadImage} = require("../utils/uploadImage");
const mongoose = require('mongoose');

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            res.redirect('/');
            res.status(404).json({error: 'User not found'});
        }
        res.json({user});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        const { userId } = req.body;
        const file = req.file;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const fileName = `avatar-${userId}`;
        const avatarUrl = await uploadImage(file.buffer, fileName, file.mimetype);
        user.avatar = avatarUrl;
        await user.save();
        res.status(200).json({ avatarUrl });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, role },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};

module.exports = {
    getUser,
    uploadAvatar,
    getAllUsers,
    updateUser,
    deleteUser
};