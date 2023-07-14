const Chat = require('../schemas/chat');
const User = require('../schemas/user');

class ChatRepository {
  async findUserByNickname(nickname) {
    const user = await User.findOne({ nickname: nickname });
    return user;
  }

  async createChat(userId, nickname, message) {
    try {
      const chatData = {
        userId: userId,
        userNickname: nickname,
        chatLog: message,
        created: new Date(),
      };

      const createdChat = await Chat.create(chatData);
      console.log('채팅 데이터 저장 완료:', createdChat);
    } catch (error) {
      console.error('채팅 데이터 저장 오류:', error);
      throw error;
    }
  }

  async findChat() {
    try {
      const recentChats = await Chat.find()
        .sort({ created: 1 })
        .limit(30)
        .select('userNickname chatLog')
        .lean();

      return recentChats;
    } catch (error) {}
  }
}

module.exports = ChatRepository;
