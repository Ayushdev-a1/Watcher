import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocketchat } from "react-icons/fa";
import { SiGotomeeting } from "react-icons/si";
import { SiGoogleclassroom } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

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
 const openChat= ()=>{
  
 }
  return (
    <>
      <div className="homePage">
         <div className="sidenav">
          <nav>
            <span className='firstSection'>
               <ul>
                <li onClick={openChat}><FaRocketchat /></li>
                <li><SiGotomeeting/></li>
                <li><SiGoogleclassroom/></li>
               </ul>
            </span>
            <span className='secondSection'>
             <ul>
              <li><IoMdSettings /></li>
              <li><CgProfile/></li>
             </ul>
            </span>
          </nav>
         </div>
      </div>
    </>
  );
}
