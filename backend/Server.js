const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db/mogoseConnect');
const path = require('path');
const http = require('http');
const Message = require('./modals/message');
const {server , app } = require('./socket/scoket');
connectDB();
dotenv.config();
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
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
}); 
server.listen(Server_PORT, () => {
  console.log(`http://localhost:${Server_PORT}`);
});
