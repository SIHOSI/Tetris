const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const authRouter = require('./routes/authRoutes.js');
const ChatService = require('./services/chatService');
const chatService = new ChatService(io);

const chatRouter = require('./routes/chatRoutes.js');
const roomRouter = require('./routes/roomRoutes.js');

const connect = require('./schemas');
const PORT = 3000;

connect();

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', [authRouter, chatRouter, roomRouter]);

io.on('connection', (socket) => {
  console.log('소켓 연결 성공');

  chatService.handleJoinLobby(socket);

  socket.on('lobbyChat', (message) => {
    chatService.handleLobbyChat(socket, message);
  });

  socket.on('disconnect', () => {
    chatService.handleDisconnect(socket);
  });
});

http.listen(PORT, () => {
  console.log(`${PORT} 포트에서 서버 실행.`);
});
