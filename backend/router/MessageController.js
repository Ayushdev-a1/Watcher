const express = require('express');
const router = express.Router();
const Message = require('../modals/message');
const protectUser = require('../middleware/protectUser');
const Conversation = require('../modals/Conversation');

// Send message
router.post('/sendMessage', protectUser, async (req, res) => {
  try {
    const { message } = req.body;
    const { id } = req.query;
    const senderID = req.user.id;

    let conversation = await Conversation.findOne({
      $or: [
        { participants: { $all: [id, senderID] } },
        { participants: { $all: [senderID, id] } }
      ]
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [id, senderID],
      });
    }

    const newMessage = new Message({
      senderID,
      id,
      message,
    });
    if(newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Get messages
router.get('/getMessage', protectUser, async (req, res) => {
  try {
    const { id } = req.query;
    const senderID = req.user.id;

    const conversation = await Conversation.findOne({
      $or: [
        { participants: { $all: [id, senderID] } },
        { participants: { $all: [senderID, id] } }
      ]
    }).populate('messages');

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

module.exports = router;
