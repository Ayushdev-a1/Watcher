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
import DP from '../assets/horse.webp'

export default function Home() {
  const navigate = useNavigate();
  const [loggedOut, setLoggedOut] = useState(false);

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
    console.log("hlo from home");
  }, [loggedOut, navigate]);
  //open chat 
  const openChat = () => {

  }
  return (
    <>
      <div className="homebox">
        <div className="homePage">
          <div className="sidenav">
            <nav>
              <span className='firstSection'>
                <ul>
                  <li onClick={openChat}><FaRocketchat /></li>
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
                <IoIosAddCircleOutline style={{cursor:'pointer'}}/>
                <BsThreeDotsVertical style={{cursor:'pointer'}}/>
              </span>
            </span>
            <span className="search">
              <span>
              <label htmlFor="search"><FaSearch/></label>
              <input type="text" placeholder="Search" />
              </span>
          </span> 
          <span className="friends">
            <span className="freindsChat">
              <span className='DP'> 
                {/* <img src={DP} alt="DP"/>   */}
                </span>
              <span className="Chatname">Name</span>
            </span>
          </span>
          </div>
          <div className="chatbox">
            <h1>chatbox</h1>
          </div>
        </div>
      </div>
    </>
  );
}
