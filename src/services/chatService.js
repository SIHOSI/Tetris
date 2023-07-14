const ChatRepository = require('../repositories/chatRepository');
const RoomRepository = require('../repositories/roomRepository');

class ChatService {
  constructor(io) {
    this.io = io;
    this.chatRepository = new ChatRepository();
    this.roomRepository = new RoomRepository();
  }

  handleJoinLobby(socket) {
    socket.on('joinLobby', (nickname) => {
      socket.userNickname = nickname;
      socket.join('lobby');
      console.log(`${socket.userNickname}님이 로비로 이동`);
    });
  }

  async handleLobbyChat(socket, data) {
    this.io.to('lobby').emit('lobbyChat', data);

    console.log(
      '🚀 ~ file: chatService.js:19 ~ ChatService ~ handleLobbyChat ~ data:',
      data
    );

    const { nickname, message } = data;

    try {
      const user = await this.chatRepository.findUserByNickname(nickname);

      console.log(
        '🚀 ~ file: chatService.js:30 ~ ChatService ~ handleLobbyChat ~ user:',
        user
      );

      await this.chatRepository.createChat(user._id, nickname, message);
    } catch (error) {
      console.log(
        '🚀 ~ file: chatService.js:47 ~ ChatService ~ handleLobbyChat ~ error:',
        error
      );
    }
  }

  async handleCreateRoom(socket, roomName) {
    const userNickname = socket.userNickname;

    const user = await this.chatRepository.findUserByNickname(userNickname);

    try {
      this.roomRepository.createRoom(user._id, userNickname, roomName);
      this.emitRoomList(); // 변경된 방 목록을 클라이언트에게 전달
    } catch (error) {
      console.error('방 생성 오류:', error);
    }
  }

  emitRoomList() {
    const rooms = this.roomRepository.findRooms();
    this.io.emit('roomList', rooms);
  }

  handleDisconnect(socket) {
    console.log(`${socket.userNickname}님이 연결 해제`);
  }
}

module.exports = ChatService;
