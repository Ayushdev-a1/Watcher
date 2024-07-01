// messageController.js
const express = require('express');
const router = express.Router();
const Message = require('../modals/message');

// Fetch messages for a chat
router.get('/getMessages', async (req, res) => {
  const { chatID } = req.query;
  try {
    const messages = await Message.find({ chatID })
      .populate('senderID', 'name email')
      .sort({ createdAt: 1 });
 
    const decryptedMessages = messages.map(message => ({
      ...message.toObject(),
      content: message.decryptContent(message.content),
    }));

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Send a message
router.post('/sendMessage', async (req, res) => {
  const { chatID, senderID, content } = req.body;
  try {
    if (!chatID || !senderID || !content) {
      return res.status(400).json({ message: 'chatID, senderID, and content are required fields.' });
    }

    const newMessage = new Message({ chatID, senderID, content });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// Receive a message (socket integration)
router.post('/receiveMessage', (req, res) => {
  const { message } = req.body;
  try {
    res.status(200).json({ success: true, message: 'Message received successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
