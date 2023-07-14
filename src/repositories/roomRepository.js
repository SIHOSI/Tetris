const Room = require('../schemas/room');
const User = require('../schemas/user');

class RoomRepository {
  async findUserByNickname(nickname) {
    const user = await User.findOne({ nickname: nickname });
    return user;
  }

  async createRoom(roomData) {
    try {
      const createdRoom = await Room.create(roomData);
      console.log('방 데이터 저장 완료:', createdRoom);
      return createdRoom;
    } catch (error) {
      console.error('방 데이터 저장 오류:', error);
      throw error;
    }
  }

  async findRooms() {
    try {
      const rooms = await Room.find()
        .sort({ created: 1 })
        .select('roomName')
        .lean();
      return rooms;
    } catch (error) {
      console.error('방 목록 조회 오류:', error);
      throw error;
    }
  }
}

module.exports = RoomRepository;
