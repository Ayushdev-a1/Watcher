import React from 'react'
import { useState } from 'react';
import './Chatbox.css';
import { BsEmojiGrin } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
export default function Chatbox() {
    const [message, setmeassage] = useState(true)
  const [sendIcon, setSendIcon] = useState(false)
  return (
    <>
      <div className="chatBox">
        <div className="message">
          {message ? (<>
            <div className="receive">
           <div className="dp">
           <CgProfile />
           </div>
           <div className='messageRecived'>i am reciver</div>
           </div>
           <div className="sent">
             
             <div className='messageSend'>i am sender</div>
           </div>
          </>) : ' No message to be Display'}

        </div>
        <div className="Typing">
          <div className="input-wrapper">
            <div className="emojis">
              <BsEmojiGrin />
            </div>
            <input type="text" id="Messages" placeholder="Messages..." />
            <div className="send">
              <IoMdSend />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
