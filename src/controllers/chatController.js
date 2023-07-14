const ChatRepository = require('../repositories/chatRepository');

class ChatController {
  constructor() {
    this.chatRepository = new ChatRepository();
  }
  async findRecentChats(req, res) {
    try {
      const recentChats = await this.chatRepository.findChat();

      res.json(recentChats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '최근 채팅 가져오기 실패' });
    }
  }
}

module.exports = ChatController;
