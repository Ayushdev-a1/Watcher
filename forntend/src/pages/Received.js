import React, { useEffect, useState } from 'react';

export default function Received() {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const email = localStorage.getItem('email');

  // Fetching requests
  const fetchRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/friends/getFriendRequest?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRequests(data.friendRequests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  // Fetching friend list
  const fetchFriends = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/friends/getFriends?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setFriends(data.friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchFriends();
  }, []);

  const respondToRequest = async (senderId, status) => {
    try {
      const response = await fetch('http://localhost:5000/api/friends/respondToRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senderId, status }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Show alert based on the status
      if (status === 'accepted') {
        alert('Friend request accepted!');
      } else if (status === 'rejected') {
        alert('Friend request rejected.');
      }
      
      setRequests(requests.filter(req => req.senderId._id !== senderId));
      fetchFriends();
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  // Filter out requests from friends
  const filteredRequests = requests.filter(req => !friends.some(friend => friend._id === req.senderId._id));

  return (
    <div>
      {filteredRequests.length === 0 ? (
        <p>No friend requests</p>
      ) : (
        filteredRequests.map(request => (
          <div key={request.senderId._id}>
            <p>{request.senderId.email}</p>
            <button onClick={() => respondToRequest(request.senderId._id, 'accepted')}>Accept</button>
            <button onClick={() => respondToRequest(request.senderId._id, 'rejected')}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}
