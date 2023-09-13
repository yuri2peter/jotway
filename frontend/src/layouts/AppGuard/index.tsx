import { io } from 'socket.io-client';
import { nanoid } from 'nanoid';
import React, { useLayoutEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SERVER_ORIGIN, USE_SOCKET } from 'src/configs';
import debugLog from 'src/utils/debugLog';

const socketUserId = nanoid();

function useSocket() {
  if (!USE_SOCKET) {
    return;
  }
  useLayoutEffect(() => {
    const socket = io(SERVER_ORIGIN);
    socket.on('connect', () => {
      debugLog('Socket connected.');
      socket.emit('login', socketUserId);
    });
    socket.on('connect_error', () => {
      debugLog('Socket connect error.');
    });
    socket.on('disconnect', () => {
      debugLog('Socket disconnected.');
    });
    return () => {
      socket.disconnect();
    };
  }, []);
}

const AppGuard: React.FC = () => {
  useSocket();
  return <Outlet />;
};

export default AppGuard;
