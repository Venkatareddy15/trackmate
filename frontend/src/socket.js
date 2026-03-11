import { io } from 'socket.io-client';

const socket = io('/', {
    path: '/api/socket.io',
    transports: ['websocket', 'polling'],
    withCredentials: true
});

export default socket;
