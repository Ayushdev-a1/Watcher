import React, { useState, useEffect, useContext } from 'react';
import { IoMdVideocam } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { socketContext } from '../context/SocketContext';

export default function Chatbox({ chatName, Chatid }) {
  const { socket } = useContext(socketContext);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');

  // Getting messages
  useEffect(() => {
    if (!Chatid) return;
    socket.emit('joinRoom', Chatid);

    const fetchMessages = async () => {
      try {
        const URL = `http://localhost:5000/api/messages/getMessage?id=${Chatid}`;
        const response = await fetch(URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          console.log('failed');
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMessages(data);
        console.log(data);
      } catch (error) {
        console.log(error, "Failed to fetch messages");
      }
    };
    fetchMessages();

    // Listen for incoming messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.emit('leaveRoom', Chatid);
      socket.off('receiveMessage');  // Clean up listener
    };
  }, [Chatid, socket]); 

  // Sending messages
  const sendMessage = async () => {
    if (messageContent.trim() === '') return;
    const URL = `http://localhost:5000/api/messages/sendMessage?id=${Chatid}`;
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message: messageContent }),
      });
      if (!response.ok) {
        console.log('failed');
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const newMessage = await response.json();
      socket.emit('sendMessage', { ...newMessage, Chatid });  // Emit the message via Socket.IO
      setMessages([...messages, newMessage]);
      setMessageContent('');
      console.log("message sent", newMessage);
    } catch (error) {
      console.log(error, "Error sending message");
    }
  };

  return (
    <div className="messageBox">
      <div className="messagerInfo">
        <span className="mDP">
          {/* Display profile picture or icon */}
        </span>
        <span className="messangerName">
          {chatName}
        </span>
        <span className='More'>
          <IoMdVideocam style={{ cursor: 'pointer' }} />
          <BsThreeDotsVertical style={{ cursor: 'pointer' }} />
        </span>
      </div>
      <div className="messageArea">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span>{msg.senderID}: {msg.message}</span>
          </div>
        ))}
      </div>
      <div className="Messagewriting">
        <input 
          type="text" 
          placeholder='Type a message'
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <span className="send" onClick={sendMessage}>
          <IoMdSend />
        </span>
      </div>
    </div>
  );
}
