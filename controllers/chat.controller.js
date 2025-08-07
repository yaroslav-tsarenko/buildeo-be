const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const Service = require('../models/service.model');
const Property = require('../models/property.model');

const createChat = async (req, res) => {
    try {
        const { role, userId, type, serviceId, propertyId, text } = req.body;

        if (!role || !userId || !type || !text || (type === 'service' && !serviceId) || (type === 'property' && !propertyId)) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let entity, entityUserId;
        if (type === 'service') {
            entity = await Service.findById(serviceId);
            if (!entity) return res.status(404).json({ error: 'Service not found' });
            entityUserId = entity.userId;
        } else if (type === 'property') {
            entity = await Property.findById(propertyId);
            if (!entity) return res.status(404).json({ error: 'Property not found' });
            entityUserId = entity.userId;
        } else {
            return res.status(400).json({ error: 'Invalid type' });
        }

        let sellerId, buyerId;
        if (role === 'buyer') {
            buyerId = userId;
            sellerId = entityUserId;
        } else if (role === 'seller') {
            sellerId = userId;
            buyerId = entityUserId;
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
            sellerFullName: `${seller.firstName} ${seller.lastName}`,
            buyerFullName: `${buyer.firstName} ${buyer.lastName}`,
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

const sendMessage = async (req, res) => {
    const { chatId, sender, text } = req.body;

    if (!chatId || !sender || !text) {
        return res.status(400).json({ error: 'chatId, sender, and text are required' });
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        const message = {
            sender,
            text,
            createdAt: new Date(),
        };

        chat.messages.push(message);
        await chat.save();

        res.status(200).json({ message });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = { createChat, getChats, sendMessage };