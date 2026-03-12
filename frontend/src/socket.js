import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : '/';

const socket = io(SOCKET_URL, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    withCredentials: true
});

export default socket;
