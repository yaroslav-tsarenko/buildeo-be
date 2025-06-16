const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, enum: ['buyer', 'seller'], required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
    sellerId: { type: String, required: true },
    buyerId: { type: String, required: true },
    sellerFullName: { type: String },
    buyerFullName: { type: String },
    sellerAvatar: { type: String },
    buyerAvatar: { type: String },
    messages: [messageSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
