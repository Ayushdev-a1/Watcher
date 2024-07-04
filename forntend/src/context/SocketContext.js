import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const socketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { loggedIn } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const userID = localStorage.getItem('User_id');

  useEffect(() => {
    if (loggedIn) {
      const newSocket = io("http://localhost:5001", {
        transports: ["websocket"],
        query: {
          userId: userID,
        }
      });
      setSocket(newSocket);

      newSocket.on('onlineUsers', (users) => {
        setOnlineUsers(users);
      });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [loggedIn]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
