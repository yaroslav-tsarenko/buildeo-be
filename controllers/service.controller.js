const Service = require('../models/service.model');
const User = require('../models/user.model');
const { uploadImage } = require('../utils/uploadImage');
const mongoose = require('mongoose');

const createService = async (req, res) => {
    try {

        const { category, description, userId, title, price } = req.body;
        const file = req.file;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const serviceType = user.role === 'buyer' ? 'offer' : 'solution';

        let photoUrl = '';
        if (file) {
            try {
                const fileName = `service-photo-${new mongoose.Types.ObjectId()}`;
                photoUrl = await uploadImage(file.buffer, fileName, file.mimetype);
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                return res.status(500).json({ error: 'Image upload failed' });
            }
        }

        const newService = new Service({
            category,
            description,
            userId,
            title,
            price,
            serviceType: [serviceType],
            photo: photoUrl,
            clientPhoneNumber: user.phoneNumber,
            createdAt: new Date()
        });

        await newService.save();
        res.status(201).json(newService);

    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getServiceById = async (req, res) => {
    try {
        const { serviceId } = req.query;

        if (!serviceId) {
            return res.status(400).json({ error: 'Service ID is required' });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const leaveComment = async (req, res) => {
    try {
        const { userId, serviceId, comment, rating } = req.body;

        if (!userId || !serviceId || !comment || !rating) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
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

        service.reviews.push(newReview);

        await service.save();

        res.status(200).json({ message: 'Review added successfully', service });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    leaveComment
};