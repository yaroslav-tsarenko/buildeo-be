const mongoose = require("mongoose");
const Property = require("../models/property.model");
const { uploadImage } = require("../utils/uploadImage");

const createProperty = async (req, res) => {
    try {
        const { title, description, price, type, location } = req.body;
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

module.exports = { createProperty, getAllProperties };