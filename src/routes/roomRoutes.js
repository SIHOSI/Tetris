const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/roomController');
const roomController = new RoomController();

// 방 생성
router.post('/rooms', roomController.createRoom.bind(roomController));

// 방 목록 가져오기
router.get('/rooms', roomController.getRoomList.bind(roomController));

module.exports = router;
