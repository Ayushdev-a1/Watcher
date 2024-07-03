const express = require('express');
const router = express.Router();
const Message = require('../modals/message');
const protectUser = require('../middleware/protectUser');
const Conversation = require('../modals/Conversation');

//send message
router.post('/sendMessage', protectUser, async (req, res) => {
  try {
    const { message } = req.body;
    const { Chatid } = req.query;
    const senderID = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [Chatid, senderID] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [Chatid, senderID],
      });
    }

    const newMessage = new Message({
      senderID,
      Chatid,
      message,
    });
    conversation.messages.push(newMessage._id);
    // await newMessage.save();
    // await conversation.save();

    await Promise.all([conversation.save(), newMessage.save()])

    res.status(201).json('new message');
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

//get the message 

router.get('getMessage', async(req, res)=>{
  try {
    const{Chatid} = req.query;
    const senderID = req.user.id;
     
    
  } catch (error) {
    console.log('Internal Server Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
})

module.exports = router;
