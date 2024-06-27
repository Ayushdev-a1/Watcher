import React, { useEffect, useState } from 'react';

export default function Sent() {
  const [requests, setRequests] = useState([]);
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/friends/getSentRequests?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRequests(data.friendRequests.filter(req => req.senderId.email === email));
      } catch (error) {
        console.error('Error fetching sent friend requests:', error);
      }
    };

    fetchRequests();
  }, [email]);

  return (
    <div>
      {requests.length === 0 ? (
        <p>No sent friend requests</p>
      ) : (
        requests.map(request => (
          <div key={request._id}>
            <p>{request.receiverId.email}</p>
            <p>Status: {request.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
