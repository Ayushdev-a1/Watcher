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
          <div  className="message">
            <span></span>
          </div>
        
      </div>
      <div className="Messagewriting">
        <input 
          type="text" 
          placeholder='Type a message' 
          value={messageContent}
        />
        <span className="send">
          <IoMdSend />
        </span>
      </div>
    </div>
  );
}
