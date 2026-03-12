import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : '/';

console.log('[SOCKET] Connecting to:', SOCKET_URL);

const socket = io(SOCKET_URL, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
});

socket.on('connect', () => {
    console.log('[SOCKET] Connected successfully');
});

socket.on('connect_error', (error) => {
    console.log('[SOCKET] Connection error:', error.message);
});

socket.on('disconnect', (reason) => {
    console.log('[SOCKET] Disconnected:', reason);
});

export default socket;
