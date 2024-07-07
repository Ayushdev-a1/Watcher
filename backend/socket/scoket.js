const Server = require("socket.io");
const http = require("http");
const express = require("express");
const socketIo = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {};
const userStatusMap = {};

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== "undefined"){
        userSocketMap[userId] = socket.id;
        userStatusMap[userId] = 'online';
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("typing", ({ Chatid, isTyping }) => {
        const receiverSocketId = getReceiverSocketId(Chatid);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { userId, isTyping });
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { app, io, server, getReceiverSocketId };
