const express = require('express');
const { createChat, getChats } = require('../controllers/chat.controller');
const router = express.Router();

router.post('/create', createChat);
router.get('/get-chats', getChats);
module.exports = router;