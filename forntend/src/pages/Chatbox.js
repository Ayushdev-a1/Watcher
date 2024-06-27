import React, { useState } from 'react';
import { IoMdVideocam } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

export default function Chatbox({ chatName, chatID, messages, sendMessage }) {
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = () => {
    if (messageContent.trim() !== '') {
      sendMessage(messageContent);
      setMessageContent('');
    }
  };

  return (
    <>
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

        </div>
        <div className="Messagewriting">
          <input type="text" placeholder='Type a message' value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
          <span className="send" onClick={handleSendMessage}>
            <IoMdSend />
          </span>
        </div>
      </div>
    </>
  );
}
