const RoomRepository = require('../repositories/roomRepository');

class RoomController {
  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async createRoom(req, res) {
    try {
      console.log(
        '🚀 ~ file: roomController.js:12 ~ RoomController ~ createRoom ~ req.body:',
        req.body
      );
      const { roomName, nickname } = req.body;

      const user = await this.roomRepository.findUserByNickname(nickname);

      console.log(
        '🚀 ~ file: roomController.js:18 ~ RoomController ~ createRoom ~ user:',
        user
      );

      const roomData = {
        roomName,
        userId: user._id,
        userNickname: user.nickname,
        created: new Date(),
      };

      const createdRoom = await this.roomRepository.createRoom(roomData);
      res.json(createdRoom);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create room' });
    }
  }

  async getRoomList(req, res) {
    try {
      const rooms = await this.roomRepository.findRooms();
      res.json(rooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch room list' });
    }
  }
}

module.exports = RoomController;
