const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userNickname: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
