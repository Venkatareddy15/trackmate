import { io } from 'socket.io-client';

const socket = io('https://trackmate-backend.vercel.app', {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    withCredentials: true
});

export default socket;
