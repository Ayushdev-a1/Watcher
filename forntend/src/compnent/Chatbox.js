// src/components/Chatbox.js
import React, { useEffect, useState } from 'react';
import { IoMdVideocam, IoMdSend } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Typing from '../Animation/Typing';
import FilePreview from './FilePreview.js';
import { ImAttachment } from "react-icons/im";
import { useChatContext } from '../context/ChatContext';
import CallingDialouge from './CallingDialouge.js';
// import './ChatBox.css'

export default function Chatbox({ chatName, Chatid }) {
    const [minimizeBox, setMinimizeBox] = useState(false);
    const [closeBox, setCloseBox] = useState(true);
    const [position, setPosition] = useState({ top: '11%', right: '12%' });
    const { messages, setMessages, fetchMessages, sendMessage, handleTyping, messageContent, setMessageContent, file,
        setFile, isTyping, typingStatus, messageEndRef
    } = useChatContext();

    useEffect(() => {
        fetchMessages(Chatid);
    }, [Chatid, fetchMessages]);


    const minimize = () => {
        setMinimizeBox(!minimizeBox);
    };
    const close = () => {
        setCloseBox(true);
        setMinimizeBox(!minimizeBox);
       
    }
    const CallBox = ()=>{
        setCloseBox(false);
    }
    const handleDoubleClick = () => {
        const newPosition = {
          top: `${Math.floor(Math.random() * 50)}%`,  // Random top position
          left: `${Math.floor(Math.random() * 50)}%`, // Random left position
        };
        setPosition(newPosition);
      };
    // useEffect(() => {
    //     if (messageEndRef.current) {
    //         messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // }, [messages]);

    const renderMessageContent = (msg) => {
        if (msg.file) {
            const fileUrl = `http://localhost:5000/${msg.file}`;
            const fileName = msg.file.split('/').pop();
            const fileType = fileName.split('.').pop();
            const fileSize = (msg.fileSize / 1024).toFixed(2);

            if (/\.pdf$/i.test(fileName)) {
                return (
                    <FilePreview fileUrl={fileUrl} fileName={fileName} fileType="pdf" fileSize={fileSize} />
                );
            }
            if (/\.(jpe?g|png|gif)$/i.test(fileName)) {
                return (
                    <FilePreview fileUrl={fileUrl} fileName={fileName} fileType="image" fileSize={fileSize} />
                );
            }
            if (/\.mp4$/i.test(fileName)) {
                return (
                    <FilePreview fileUrl={fileUrl} fileName={fileName} fileType="video" fileSize={fileSize} />
                );
            }
            return (
                <FilePreview
                    fileUrl={fileUrl}
                    fileName={fileName}
                    fileType="unknown"
                    fileSize={fileSize}
                />
            );
        }
        return <span>{msg.message}</span>;
    };

    return (
        <div className="messageBox">
            <div className="messagerInfo">
                <span className="mDP">{/* Display profile picture or icon */}</span>
                <span className="messangerName">{chatName}</span>
                <span className="More">
                    <IoMdVideocam onClick={CallBox} title='make call' style={{ cursor: 'pointer' }} />
                    <BsThreeDotsVertical style={{ cursor: 'pointer' }} />
                </span>
            </div>
            {closeBox ? (<></>) : (
                <>
                    <div className={` ${minimizeBox ? 'call-dialouge-Minibox' : 'call-dialouge-box'}`}
                    style={{ position: 'absolute', ...position }}>
                        <CallingDialouge minimize={minimize} close={close} handleDoubleClick={handleDoubleClick} />
                    </div>
                </>)}

            <div className="messageArea">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.id === Chatid ? 'sent' : 'received'}`}>
                        {renderMessageContent(msg)}
                        <span className="time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                ))}
                <div ref={messageEndRef}></div>
                {typingStatus && <div className="typingStatus">{typingStatus}</div>}
            </div>
            <div className="Messagewriting">
                <input type="text" placeholder="Type a message" value={messageContent} onChange={(e) => handleTyping(Chatid, e)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(Chatid, messageContent)} />
                <div className='Send-option'>
                    <label htmlFor="file" title='Upload File' className="file-input-label">
                        <ImAttachment />
                        <input type="file" name="file" id="file" className="file-input" onChange={(e) => setFile(e.target.files[0])} />
                    </label>
                    <span className="send" onClick={() => sendMessage(Chatid, messageContent)}>
                        <IoMdSend />
                    </span>
                </div>
            </div>
        </div>
    );
}
