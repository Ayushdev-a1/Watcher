import React, { useState, useEffect, useRef } from 'react';
import { IoMdVideocam, IoMdSend } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { io } from 'socket.io-client';
import Typing from '../Animation/Typing';

//socketConnection
const socket = io("http://localhost:5001", {
    transports: ['websocket'],
    query: {
        userId: localStorage.getItem('User_id')
    }
});

export default function Chatbox({ chatName, Chatid }) {
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingStatus, setTypingStatus] = useState(null);
    const messageEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Function to fetch initial messages
    useEffect(() => {
        fetchMessages();
        socket.on('newMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        socket.on('typing', ({ userId, isTyping }) => {
            if (isTyping) {
                setTypingStatus(<Typing/>);
            } else {
                setTypingStatus(null);
            }
        });
        return () => {
            socket.off('newMessage');
            socket.off('typing');
        };
    }, [Chatid]);

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
                console.log('Failed to fetch messages');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setMessages(data);
            console.log('Initial messages fetched', data);
        } catch (error) {
            console.error('Error fetching initial messages:', error);
        }
    };

    // Function to send message
    const sendMessage = async () => {
        if (messageContent.trim() === '') return;

        const URL = `http://localhost:5000/api/messages/sendMessage?id=${Chatid}`;
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ message: messageContent }),
            });
            if (!response.ok) {
                console.log('Failed to send message');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const newMessage = await response.json();
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageContent(''); // Clear message input
            console.log('Message sent:', newMessage);

            // Emit the new message to other users
            socket.emit('sendMessage', { Chatid, message: messageContent });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleTyping = (e) => {
        setMessageContent(e.target.value);
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { Chatid, isTyping: true });
        }
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('typing', { Chatid, isTyping: false });
        }, 2000);
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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
                {messages.map((msg, index) => (<>
                    <div key={index} className={`message ${msg.id === Chatid ? 'sent' : 'received'}`}>
                        <span>{msg.message}</span>
                        <span className="time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                    </>
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
                <span className="send" onClick={sendMessage}>
                    <IoMdSend />
                </span>
            </div>
        </div>
    );
}
