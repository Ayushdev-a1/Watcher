import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocketchat } from "react-icons/fa";
import { SiGotomeeting } from "react-icons/si";
import { SiGoogleclassroom } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import io from 'socket.io-client';
import Chatbox from './Chatbox';

const socket = io('http://localhost:5000'); // Replace with your server URL

export default function Home() {
  const navigate = useNavigate();
  const [loggedOut, setLoggedOut] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const logout = () => {
    localStorage.removeItem('token');
    alert("Are you sure you want to log out?");
    setLoggedOut(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [loggedOut, navigate]);

  // Open chat
  const openChat = (chat) => {
    setSelectedChat(chat);
    // Initialize Socket.IO for the selected chat
    socket.emit('joinChat', chat.id); // Tell server which chat room to join
    // Replace with fetching messages from server if not using Socket.IO for messages
    setMessages([]); // Placeholder for fetching messages
  };

  // Receive new messages
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (messageContent) => {
    const message = {
      chatId: selectedChat.id,
      content: messageContent,
      sender: 'currentUserId', // Replace with actual user ID
      timestamp: new Date().toISOString()
    };
    socket.emit('sendMessage', message);
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const chatList = [
    { id: 1, name: 'Chat 1' },
    { id: 2, name: 'Chat 2' },
    { id: 3, name: 'Chat 3' },
  ];

  return (
    <>
      <div className="homebox">
        <div className="homePage">
          <div className="sidenav">
            <nav>
              <span className='firstSection'>
                <ul>
                  <li><FaRocketchat /></li>
                  <li><SiGotomeeting /></li>
                  <li><SiGoogleclassroom /></li>
                </ul>
              </span>
              <span className='secondSection'>
                <ul>
                  <li><IoMdSettings /></li>
                  <li><CgProfile /></li>
                </ul>
              </span>
            </nav>
          </div>
          <div className="chats">
            <span className="chatheading">
              <h4>Chats</h4>
              <span>
                <IoIosAddCircleOutline style={{ cursor: 'pointer' }} />
                <BsThreeDotsVertical style={{ cursor: 'pointer' }} />
              </span>
            </span>
            <span className="search">
              <span>
                <label htmlFor="search"><FaSearch /></label>
                <input type="text" placeholder="Search" />
              </span>
            </span>
            <span className="friends">
              {chatList.map(chat => (
                <span className="freindsChat" key={chat.id} onClick={() => openChat(chat)}>
                  <span className='DP'></span>
                  <span className="Chatname">{chat.name}</span>
                </span>
              ))}
            </span>
          </div>
          <div className="chatbox">
            {selectedChat && <Chatbox chatID={selectedChat.id} chatName={selectedChat.name} messages={messages} sendMessage={sendMessage} />}
          </div>
        </div>
      </div>
    </>
  );
}
