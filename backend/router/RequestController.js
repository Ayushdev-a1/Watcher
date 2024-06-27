const express = require('express');
const User = require('../modals/user')

const router = express.Router();

// Send request 
// Send request 
router.post('/send', async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;

  if (!senderEmail || !receiverEmail || senderEmail === receiverEmail) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const existingRequest = receiver.friendRequests.find(
      (request) => request.senderId.toString() === sender._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    receiver.friendRequests.push({ senderId: sender._id, receiverId: receiver._id });
    await User.findByIdAndUpdate(receiver._id, { friendRequests: receiver.friendRequests }, { new: true });

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// Get friend requests
router.get('/getFriendRequest', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email }).populate('friendRequests.senderId', 'email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ friendRequests: user.friendRequests });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
});
// Respond to request
router.post('/respondToRequest', async (req, res) => {
  const { email, senderId, status } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const request = user.friendRequests.find(req => req.senderId.toString() === senderId);

      if (!request) {
          return res.status(404).json({ message: 'Friend request not found' });
      }

      request.status = status;
      await User.findByIdAndUpdate(user._id, { friendRequests: user.friendRequests }, { new: true });

      res.status(200).json({ message: 'Friend request updated' });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error });
  }
});

// Get friends list
router.get('/getFriends', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email }).populate('friends', 'email name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

//getsentfriedlist
router.get('/getSentRequests', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email }).populate('friendRequests.receiverId', 'email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming each user also has a 'sentRequests' field to track sent friend requests
    const sentRequests = await User.aggregate([
      { $match: { 'friendRequests.senderId': user._id } },
      { $unwind: '$friendRequests' },
      { $match: { 'friendRequests.senderId': user._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'friendRequests.receiverId',
          foreignField: '_id',
          as: 'receiverDetails'
        }
      },
      { $unwind: '$receiverDetails' },
      {
        $project: {
          _id: 0,
          'friendRequests._id': 1,
          'friendRequests.status': 1,
          'receiverDetails.email': 1
        }
      }
    ]);

    res.status(200).json({ friendRequests: sentRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
