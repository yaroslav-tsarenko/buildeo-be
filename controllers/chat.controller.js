const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const Service = require('../models/service.model');

const createChat = async (req, res) => {
    try {
        const { role, userId, serviceId, text } = req.body;

        if (!role || !userId || !serviceId || !text) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        let sellerId, buyerId;

        if (role === 'buyer') {
            buyerId = userId;
            sellerId = service.userId;
        } else if (role === 'seller') {
            sellerId = userId;
            buyerId = service.userId;
        } else {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const seller = await User.findById(sellerId);
        const buyer = await User.findById(buyerId);

        if (!seller || !buyer) {
            return res.status(404).json({ error: 'Seller or Buyer not found' });
        }

        const newChat = new Chat({
            sellerId,
            buyerId,
            sellerAvatar: seller.avatar,
            buyerAvatar: buyer.avatar,
            messages: [
                {
                    sender: role,
                    text,
                    createdAt: new Date(),
                },
            ],
        });

        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getChats = async (req, res) => {
    try {
        const { userId, role } = req.query;

        if (!userId || !role) {
            return res.status(400).json({ error: 'User ID and role are required' });
        }

        const filter = role === 'buyer' ? { buyerId: userId } : { sellerId: userId };
        const chats = await Chat.find(filter);

        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = { createChat, getChats };