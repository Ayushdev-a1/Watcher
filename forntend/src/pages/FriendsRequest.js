import React, { useState , useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Received from './Received';
import Sent from './Sent';
import { io } from "socket.io-client";
import Friendlist from './Friendlist';
export default function FriendsRequest() {
  const [section, setSection] = useState('friendsList');
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const URL = "http://localhost:5001";
const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"]
});


  useEffect(() => {
    socket.on('new friend request', (receiverEmail) => {
      if (receiverEmail === localStorage.getItem('email')) {
        setNotifications(prev => [...prev, 'You have a new friend request']);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const searchUser = async () => {
    try {

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/search?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    if (response.status === 404) {
      alert('User not found');
      setSearchResult(null);
      return;
    }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResult(data.user);
    } catch (error) {
      console.error('Error searching user', error);
    }
  };

  const sendFriendRequest = async (receiverEmail) => {
  try {
    const senderEmail = localStorage.getItem('email'); 
    
    if (!senderEmail || !receiverEmail) {
      throw new Error('Sender or receiver email is missing');
    }

    const response = await fetch('http://localhost:5000/api/friends/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderEmail,
        receiverEmail,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.message}`);
    }

    socket.emit('send friend request', { receiverEmail });
    alert('Friend request sent');
  } catch (error) {
    console.error('Error sending friend request', error);
    alert(`Error sending friend request: ${error.message}`);
  }
};


  return (
    <>
      <div className="FriendsHeading">
        <h4>
          <span>Friends</span>
        </h4>
      </div>
      <span className="search">
        <span>
          <label htmlFor="search"><FaSearch /></label>
          <input
            type="text"
            placeholder="Search by Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={searchUser}>Search</button>
        </span>
      </span>
      {searchResult && (
        <div className="searchResult">
          <p>{searchResult.email}</p>
          <button onClick={() => sendFriendRequest(searchResult.email)}>Send Friend Request</button>
        </div>
      )}
      <div className="Status">
        <button onClick={() => setSection('friendsList')}>Friends</button>
        <button onClick={() => setSection('Received')}>Received</button>
        <button onClick={() => setSection('Sent')}>Sent</button>
      </div>
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map((notification, index) => (
            <p key={index}>{notification}</p>
          ))}
        </div>
      )}
      {section === 'friendsList' &&(
        <div className="friendlist">
          <Friendlist/>
        </div>
      )}
      {section === 'Received' && (
        <div className="ReceivedRequest">
          <Received />
        </div>
      )}
      {section === 'Sent' && (
        <div className="SentRequest">
          <Sent />
        </div>
      )}
    </>
  );
}
