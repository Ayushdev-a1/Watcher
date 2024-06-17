const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db/mogoseConnect');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

connectDB();

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
const userRouter = require('./router/Authentication');
const meetingController = require('./router/MeetingController');

app.use("/api/meetings", meetingController);
app.use("/api/auth", userRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
//messages
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join room', ({ meetingId, userId }) => {
    socket.join(meetingId);
    io.to(meetingId).emit('user joined', userId);
  });

  socket.on('send message', ({ meetingId, message }) => {
    io.to(meetingId).emit('receive message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});