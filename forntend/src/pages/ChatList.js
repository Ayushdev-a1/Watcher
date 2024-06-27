import React, { useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
export default function ChatList({ SelectedChat, setSelectedChat, setActiveSection, ActiveSection }) {
    const openChat = (chat) => {
        setSelectedChat(chat);
    };

    const chatList = [
        { id: 1, name: 'Chat 1' },
        { id: 2, name: 'Chat 2' },
        { id: 3, name: 'Chat 3' },
    ];
    return (
        <>
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
            
        </>
    )
}
