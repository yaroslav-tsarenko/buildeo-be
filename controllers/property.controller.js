const mongoose = require("mongoose");
const Property = require("../models/property.model");
const { uploadImage } = require("../utils/uploadImage");

const User = require("../models/user.model");

const createProperty = async (req, res) => {
    try {
        const { title, description, price, type, location, userId } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "At least one photo is required" });
        }

        const uploadedPhotos = await Promise.all(
            files.map((file) => {
                const fileName = `property-image-${new mongoose.Types.ObjectId()}`;
                return uploadImage(file.buffer, fileName, file.mimetype);
            })
        );

        const property = new Property({
            title,
            description,
            price,
            type,
            location,
            userId,
            photos: uploadedPhotos,
        });

        await property.save();

        res.status(201).json({ message: "Property created successfully", property });
    } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getProperty = async (req, res) => {
    const propertyId = req.query.propertyId;

    try {
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const leaveComment = async (req, res) => {
    try {
        const { userId, propertyId, comment, rating } = req.body;

        if (!userId || !propertyId || !comment || !rating) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newReview = {
            firstName: user.firstName,
            lastName: user.lastName,
            rating,
            comment,
            avatar: user.avatar || '',
        };

        property.reviews.push(newReview);

        await property.save();

        res.status(200).json({ message: 'Review added successfully', property });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = { createProperty, getAllProperties, getProperty, leaveComment };