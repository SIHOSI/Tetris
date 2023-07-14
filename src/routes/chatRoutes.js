const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const chatController = new ChatController();

// 최근 메시지 가져오기
router.get('/chat/lobby', chatController.findRecentChats.bind(chatController));

module.exports = router;
