const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const roomRoutes = require('./routes/roomRoutes');
const Room = require('./models/Room'); // Don't forget to import your Room model

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'https://collab-text-whiteboard.vercel.app', // Replace with your actual frontend domain
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);

// On socket connection
io.on('connection', socket => {
    console.log('⚡️ A user connected:', socket.id);

    socket.on('join-room', async ({ roomId }) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Send current content
        const room = await Room.findOne({ roomId });
        if (room) socket.emit('room-content', { content: room.content });
    });

    socket.on('send-changes', async ({ roomId, content }) => {
        // Broadcast updates to other users in room
        socket.to(roomId).emit('receive-changes', { content });

        // Persist content in DB
        await Room.findOneAndUpdate({ roomId }, { content }, { new: true, upsert: true });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .catch(console.error);
