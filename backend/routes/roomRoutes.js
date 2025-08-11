const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Create or get a room
router.post('/create', async (req, res) => {
    const { roomId } = req.body;
    if (!roomId) return res.status(400).json({ message: 'Room ID is required' });

    try {
        let room = await Room.findOne({ roomId });
        if (!room) {
            room = new Room({ roomId });
            await room.save();
        }
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get room by ID
router.get('/:roomId', async (req, res) => {
    try {
        const room = await Room.findOne({ roomId: req.params.roomId });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update room content
router.put('/:roomId', async (req, res) => {
    try {
        const { content } = req.body;
        const room = await Room.findOneAndUpdate(
            { roomId: req.params.roomId },
            { content },
            { new: true }
        );
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
