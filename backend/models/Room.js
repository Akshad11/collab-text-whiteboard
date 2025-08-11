const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    content: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
