const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const statsRoutes = require('./routes/statsRoutes');

const ChatMessage = require('./models/ChatMessage');
const Trip = require('./models/Trip');
const Booking = require('./models/Booking');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    path: '/api/socket.io',
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.IO logic
io.on('connection', (socket) => {
    socket.on('joinTrip', (tripId) => socket.join(tripId));
    socket.on('joinUser', (userId) => socket.join(userId));
    socket.on('sendMessage', async (data) => {
        try {
            io.to(data.tripId).emit('receiveMessage', data);
            await ChatMessage.create({
                tripId: data.tripId,
                senderId: data.senderId,
                message: data.message
            });
        } catch (err) {
            console.error('Socket Message Error:', err);
        }
    });
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection middleware
const dbMiddleware = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('DB_MIDDLEWARE_ERROR:', err);
        next();
    }
};

app.use(dbMiddleware);

// Pass io to request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/.netlify/functions/api/auth', authRoutes);
app.use('/.netlify/functions/api/trips', tripRoutes);
app.use('/.netlify/functions/api/bookings', bookingRoutes);
app.use('/.netlify/functions/api/notifications', notificationRoutes);
app.use('/.netlify/functions/api/payments', paymentRoutes);
app.use('/.netlify/functions/api/stats', statsRoutes);

module.exports.handler = serverless(app);
