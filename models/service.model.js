const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    category: { type: String },
    description: { type: String, required: true },
    userId: { type: String },
    rating: { type: String },
    title: { type: String },
    photo: { type: String },
    offerings: { type: Number },
    price: { type: Number },
    clientPhoneNumber: { type: String},
    reviews: [{
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        comment: { type: String, required: true },
        avatar: { type: String, required: true }
    }],
    serviceType: {
        type: [String],
        enum: ['offer', 'solution'],
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;