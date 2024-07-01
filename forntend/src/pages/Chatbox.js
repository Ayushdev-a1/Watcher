import React, { useState, useEffect } from 'react';
import { IoMdVideocam } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001", {
  transports: ["websocket"],
});

export default function Chatbox({ chatName, Chatid }) {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', Chatid);

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/messages/getMessages?chatID=${Chatid}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    socket.on('receiveMessage', (message) => {
      console.log('Message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.emit('leaveRoom', Chatid); 
    };
  }, [Chatid]);

  const sendMessage = async () => {
    if (messageContent.trim() === '') return;
    const newMessage = {
      chatID: Chatid,
      senderID: localStorage.getItem('User_id'),
      content: messageContent,
    };

    console.log('Sending message:', newMessage);

    socket.emit('sendMessage', newMessage);

    try {
      const response = await fetch('http://localhost:5000/api/messages/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
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
        {messages.map((msg, index) => {
          const isSent = msg.senderID === localStorage.getItem('User_id');
          return (
            <div key={index} className={`message ${isSent ? 'sent' : 'received'}`}>
              <span>{msg.content}</span>
            </div>
          );
        })}
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
