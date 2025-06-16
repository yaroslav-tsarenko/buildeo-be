const express = require('express');
const { createChat, getChats, sendMessage } = require('../controllers/chat.controller');
const router = express.Router();

router.post('/create', createChat);
router.get('/get-chats', getChats);
router.post('/send-message', sendMessage);

module.exports = router;