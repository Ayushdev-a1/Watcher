import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocketchat } from "react-icons/fa";
import { SiGotomeeting } from "react-icons/si";
import { SiGoogleclassroom } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Chatbox from './Chatbox';
import ChatList from './ChatList';
import Defult from './Defult';
import FriendsRequest from './FriendsRequest';
import Profile from './Profile';
import { io } from "socket.io-client";

const URL = "http://localhost:5001";
const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"]
});

export default function Home() {
  const navigate = useNavigate();
  const [loggedOut, setLoggedOut] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ActiveSection, setActiveSection] = useState('chat')
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loggedin, setLoggedin] = useState(false);
  const [Chatid , setChatid] = useState();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [loggedOut, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedin(true)
    }
  })
  //fetching logeged in user data
  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/auth/getuser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.log('failed');
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProfileData(data);
      localStorage.setItem("email", data.email)
      localStorage.setItem("User_id", data._id);
    } catch (error) {
      console.error('Error getting user data', error);
      setError(error.message);
    }
  };
  useEffect(() => {
    if (loggedin) {
      fetchProfileData();
    }
  }, [loggedin]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);
  return (
    <>
      <div className="homebox">
        <div className="homePage">
          <div className="sidenav">
            <nav>
              <span className='firstSection'>
                <ul>
                  <li id='chat' className={ActiveSection === 'chat' ? 'active' : ''} onClick={() => setActiveSection('chat')}><FaRocketchat /></li>
                  <li id='meeting' className={ActiveSection === 'meeting' ? 'active' : ''} onClick={() => setActiveSection('meeting')}><SiGotomeeting /></li>
                  <li id='Friends' className={ActiveSection === 'Friends' ? 'active' : ''} onClick={() => setActiveSection('Friends')}><SiGoogleclassroom /></li>
                </ul>
              </span>
              <span className='secondSection'>
                <ul>
                  <li id='settings' className={ActiveSection === 'settings' ? 'active' : ''} onClick={() => setActiveSection('settings')}><IoMdSettings /></li>
                  <li id='profile' className={ActiveSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}><CgProfile /></li>
                </ul>
              </span>
            </nav>
          </div>
          {ActiveSection === 'profile' && (
            <div className="profile">
              <Profile fetchProfileData={fetchProfileData} profileData={profileData} error={error} />
            </div>
          )}
          {ActiveSection === 'meeting' && (
            <>
              <div className="meeting">
                <h1>meeting</h1>
              </div>
            </>
          )}
          {ActiveSection === 'settings' && (
            <>
              <div className="setting">
                <h1>setting</h1>
              </div>
            </>
          )}

          {ActiveSection === 'Friends' && (<>
            <div className="friendsRequest">
              <FriendsRequest />
            </div>
          </>)}

          {ActiveSection === 'chat' && (
            <>
              <div className="chats">
                <ChatList SelectedChat={selectedChat} setSelectedChat={setSelectedChat} ActiveSection={ActiveSection} setActiveSection={setActiveSection} setChatid = {setChatid} />
              </div>
            </>
          )}
          {(ActiveSection === 'chat' || ActiveSection === 'settings' || ActiveSection === 'profile' || ActiveSection === 'Friends') && (
            <>
              <div className="chatbox">
                {selectedChat ? (
                  <> 
                    <Chatbox chatID={selectedChat.id} Chatid ={Chatid} chatName={selectedChat.name} />
                  </>
                ) : (
                  <>
                    <Defult />
                  </>
                )}
              </div>
            </>
          )}


        </div>
      </div>
    </>
  );
}
