import React, { useState, useEffect, useRef } from 'react';
import { IoMdVideocam, IoMdSend } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Typing from '../Animation/Typing';
import { useSocketContext } from '../context/SocketContext';
import FilePreview from './FilePreview.js';
import { ImAttachment } from "react-icons/im";

export default function Chatbox({ chatName, Chatid }) {
    const { newsocket } = useSocketContext();
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [file, setFile] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingStatus, setTypingStatus] = useState(null);
    const messageEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        if (newsocket) {
            newsocket.on('newMessage', (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
            newsocket.on('typing', ({ userId, isTyping }) => {
                if (isTyping) {
                    setTypingStatus(<Typing />);
                } else {
                    setTypingStatus(null);
                }
            });
        }
        return () => {
            if (newsocket) {
                newsocket.off('newMessage');
                newsocket.off('typing');
            }
        };
    }, [Chatid, newsocket]);

    const fetchMessages = async () => {
        try {
            const URL = `http://localhost:5000/api/messages/getMessage?id=${Chatid}`;
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching initial messages:', error);
        }
    };

    const sendMessage = async () => {
        if (messageContent.trim() === '' && !file) return;

        const URL = `http://localhost:5000/api/messages/sendMessage?id=${Chatid}`;
        const formData = new FormData();
        formData.append('message', messageContent);
        if (file) formData.append('file', file);

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    Authorization: `${localStorage.getItem('token')}`,
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const newMessage = await response.json();
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageContent('');
            setFile(null);

            if (newsocket) {
                newsocket.emit('sendMessage', { Chatid, message: messageContent });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleTyping = (e) => {
        setMessageContent(e.target.value);
        if (!isTyping && newsocket) {
            setIsTyping(true);
            newsocket.emit('typing', { Chatid, isTyping: true });
        }
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            if (newsocket) {
                newsocket.emit('typing', { Chatid, isTyping: false });
            }
        }, 2000);
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const renderMessageContent = (msg) => {
        if (msg.file) {
            const fileUrl = `http://localhost:5000/${msg.file}`;
            const fileName = msg.file.split('/').pop();
            const fileType = fileName.split('.').pop();
            const fileSize = (msg.fileSize / 1024).toFixed(2);

            if (/\.pdf$/i.test(fileName)) {
                return (
                    <FilePreview
                        fileUrl={fileUrl}
                        fileName={fileName}
                        fileType="pdf"
                        fileSize={fileSize} />
                );
            }
            if (/\.(jpe?g|png|gif)$/i.test(fileName)) {
                return (
                    <FilePreview
                        fileUrl={fileUrl}
                        fileName={fileName}
                        fileType="image"
                        fileSize={fileSize}
                    />
                );
            }
            if (/\.mp4$/i.test(fileName)) {
                return (
                    <FilePreview
                        fileUrl={fileUrl}
                        fileName={fileName}
                        fileType="video"
                        fileSize={fileSize}
                    />
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
                    <IoMdVideocam style={{ cursor: 'pointer' }} />
                    <BsThreeDotsVertical style={{ cursor: 'pointer' }} />
                </span>
            </div>
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
                <input
                    type="text"
                    placeholder="Type a message"
                    value={messageContent}
                    onChange={handleTyping}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <label htmlFor="file" title='Upload File' className="file-input-label">
                  <ImAttachment />
                    <input
                        type="file"
                        name="file"
                        id="file"
                        className="file-input"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </label>
                <span className="send" onClick={sendMessage}>
                    <IoMdSend />
                </span>
            </div>
        </div>
    );
}
