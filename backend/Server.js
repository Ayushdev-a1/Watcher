const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db/mogoseConnect');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./modals/message');
connectDB();

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;
const Server_PORT = process.env.SERVER_PORT || 5001;

app.use(bodyParser.json());
app.use(cors());
const userRouter = require('./router/Authentication');
const meetingController = require('./router/MeetingController');
const RequestController = require('./router/RequestController');
const MessageController = require('./router/MessageController');

// routers api
app.use("/api/meetings", meetingController);
app.use("/api/auth", userRouter);
app.use("/api/friends", RequestController);
app.use("/api/messages", MessageController);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// io connection 
const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  const { userId } = socket.handshake.query;
  userSocketMap[userId] = socket.id;

  io.emit('onlineUsers', Object.keys(userSocketMap));

  socket.on('sendMessage', ({ message, recipientId }) => {
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receiveMessage', { message, senderId: userId });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('onlineUsers', Object.keys(userSocketMap));
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
}); 
server.listen(Server_PORT, () => {
  console.log(`http://localhost:${Server_PORT}`);
});
