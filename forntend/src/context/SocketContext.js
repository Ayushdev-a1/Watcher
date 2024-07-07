import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const socketContext = createContext();
export const useSocketContext = () => {
  return useContext(socketContext);
};
export const SocketProvider = ({ children }) => {
  const { loggedIn, profileData } = useContext(AuthContext);
  const [newsocket, setNewSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const User_id = localStorage.getItem('User_id');
  useEffect(() => {
    if (loggedIn && User_id) {
      const Socket = io('http://localhost:5001', {
        transports: ['websocket'],
        query: {
          userId: User_id ,
        },
      });

      setNewSocket(Socket);

      Socket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      return () => {
        Socket.close();
        setNewSocket(null);
      };
    }
  }, [loggedIn]);

  return (
    <socketContext.Provider value={{ newsocket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
