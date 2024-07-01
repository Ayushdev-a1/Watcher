import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function ChatList({ SelectedChat, setSelectedChat, setChatid, setActiveSection, ActiveSection }) {
    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const email = localStorage.getItem('email');
                const response = await fetch(`http://localhost:5000/api/friends/getFriends?email=${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched friends:', data.friends); // Debugging line
                setChatList(data.friends);
                if (data.friends.length > 0) {
                    setChatid(data.friends[0].chatID);
                    console.log('Initial chatID:', data.friends[0].chatID); // Debugging line
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, []);

    const openChat = (chat) => {
        setSelectedChat(chat);
        setActiveSection('chat');
        if (chat.chatID) {
            setChatid(chat.chatID);
        } else {
            console.warn('ChatID is undefined');
        }
    };

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
                    <span className="freindsChat" key={chat._id} onClick={() => openChat(chat)}>
                        <span className='DP'></span>
                        <span className="Chatname">{chat.name}</span>
                    </span>
                ))}
            </span>
        </>
    );
}
