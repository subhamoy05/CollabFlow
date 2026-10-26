import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getAccessToken } from '../services/api';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [projectPresence, setProjectPresence] = useState({});
  const activeProjectRef = useRef(null);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = getAccessToken();
    const socketInstance = io(window.location.origin, {
      path: '/socket.io',
      withCredentials: true,
      auth: { token },
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      // Re-join active project room if reconnected
      if (activeProjectRef.current) {
        socketInstance.emit('project:join', { projectId: activeProjectRef.current });
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('project:presence', ({ projectId, onlineUsers }) => {
      setProjectPresence(prev => ({
        ...prev,
        [projectId]: onlineUsers
      }));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  const joinProject = (projectId) => {
    activeProjectRef.current = projectId;
    if (socket && isConnected) {
      socket.emit('project:join', { projectId });
    }
  };

  const leaveProject = (projectId) => {
    if (activeProjectRef.current === projectId) {
      activeProjectRef.current = null;
    }
    if (socket && isConnected) {
      socket.emit('project:leave', { projectId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinProject,
        leaveProject,
        projectPresence
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
