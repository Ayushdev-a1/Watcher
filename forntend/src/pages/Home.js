import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocketchat } from "react-icons/fa";
import { SiGotomeeting } from "react-icons/si";
import { SiGoogleclassroom } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Chatbox from '../compnent/Chatbox';
import ChatList from '../compnent/ChatList';
import Defult from './Defult';
import FriendsRequest from './FriendsRequest';
import Profile from './Profile';
// import { useSocketContext } from '../context/SocketContext';
import Loader from './Loader';
import Button from '../Icons/Button';
 
export default function Home() {
  const navigate = useNavigate();
  // const { socket, onlineUsers } = useSocketContext();
  const [loggedOut, setLoggedOut] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [ActiveSection, setActiveSection] = useState('chat');
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loggedin, setLoggedin] = useState(false);
  const [Chatid, setChatid] = useState(null);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setLoggedin(true);
    }
  }, [loggedOut, navigate]);

  // Fetching logged-in user data
  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/auth/getuser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      });

      if (!response.ok) {
        console.log('failed');
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setProfileData(data);
      localStorage.setItem("email", data.email);
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
                  <li id='Logout' className='Logout'><Button/></li>
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
                <h1>Meeting</h1>
              </div>
            </>
          )}
          {ActiveSection === 'settings' && (
            <>
              <div className="setting">
                <h1>Settings</h1>
              </div>
            </>
          )}
          {ActiveSection === 'Friends' && (
            <>
              <div className="friendsRequest">
                <FriendsRequest />
              </div>
            </>
          )}
          {ActiveSection === 'chat' && (
            <>
              <div className="chats">
                <ChatList 
                  SelectedChat={selectedChat} 
                  setSelectedChat={setSelectedChat} 
                  setChatid={setChatid} 
                  setActiveSection={setActiveSection} 
                  ActiveSection={ActiveSection} 
                />
              </div>
            </>
          )}
          {(ActiveSection === 'chat' || ActiveSection === 'settings' || ActiveSection === 'profile' || ActiveSection === 'Friends') && (
            <>
              <div className="chatbox">
                {selectedChat ? (
                  <Chatbox 
                    chatName={selectedChat?.name} 
                    Chatid={Chatid} 
                  />
                ) : (
                  <Defult profileData={profileData}/>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
