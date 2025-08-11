import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoomLanding() {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const goCreate = () => {
        const newId = Math.random().toString(36).substring(2, 8);
        navigate(`/room/${newId}`);
    };

    const goJoin = () => {
        if (!roomId.trim()) return alert('Please enter a Room ID');
        navigate(`/room/${roomId.trim()}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Collaborative Whiteboard</h1>
            <div className="space-y-4">
                <button
                    onClick={goCreate}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create Room
                </button>
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Room ID"
                        value={roomId}
                        onChange={e => setRoomId(e.target.value)}
                        className="p-2 border rounded-l-md"
                    />
                    <button
                        onClick={goJoin}
                        className="p-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
}
