import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSocketContext } from '../context/SocketContext';

export default function ChatList({ SelectedChat, setSelectedChat, setChatid, setActiveSection, ActiveSection }) {
    const [chatList, setChatList] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { newsocket } = useSocketContext();
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
                setChatList(data.friends);
                if (data.friends.length > 0) {
                    setChatid(data.friends[0]._id);
                    console.log('Initial id:', data.friends[0]._id);
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [setChatid]);

    useEffect(() => {
        if (newsocket) {
            newsocket.on('getOnlineUsers', (users) => {
                setOnlineUsers(users);
            });
        }

        return () => {
            if (newsocket) {
                newsocket.off('getOnlineUsers');
            }
        };
    }, [newsocket]);

    const openChat = (chat) => {
        setSelectedChat(chat);
        setActiveSection('chat');
        if (chat.Chatid) {
            setChatid(chat._id);
            console.log('selected chatID:', chat._id);
        } else {
            console.warn('ChatID is undefined');
        }
    };

    const isUserOnline = (userId) => onlineUsers.includes(userId);

    return (
        <>
            <span className="chatheading">
                <h4>Chats</h4>
                <span>
                    <IoIosAddCircleOutline title='Make Group' style={{ cursor: 'pointer' }} />
                    <BsThreeDotsVertical title='More' style={{ cursor: 'pointer' }} />
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
                        <span className="Chatname">
                            {chat.name}
                            <p className='notificationBadge'>+1 new message</p>
                        </span>
                        <span className={`onlineBadge ${isUserOnline(chat._id) ? 'online' : 'offline'}`}></span>
                    </span>
                ))}
            </span>
        </>
    );
}
