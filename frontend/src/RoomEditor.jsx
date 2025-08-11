import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { io } from 'socket.io-client';
import throttle from 'lodash/throttle';

export default function RoomEditor() {
    const { roomId } = useParams();
    const socketRef = useRef(null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p></p>',
    });

    useEffect(() => {
        const apiUrl = 'https://collab-text-whiteboard.onrender.com/api/rooms';
        socketRef.current = io(apiUrl);
        socketRef.current.emit('join-room', { roomId });

        socketRef.current.on('room-content', ({ content }) => {
            editor?.commands.setContent(content);
        });

        socketRef.current.on('receive-changes', ({ content }) => {
            const cursor = editor?.state.selection.$cursor;
            editor?.commands.setContent(content);
            if (cursor) editor?.view.dispatch(editor?.view.state.tr.setSelection(cursor));
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId, editor]);

    useEffect(() => {
        if (!editor) return;

        // Throttled update function — sends at most every 300ms
        const throttledEmit = throttle(() => {
            const html = editor.getHTML();
            socketRef.current.emit('send-changes', { roomId, content: html });
        }, 300);

        editor.on('update', throttledEmit);

        return () => {
            throttledEmit.cancel();
        };
    }, [editor, roomId]);

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Room ID: {roomId}</h2>
            </div>
            {!editor ? (
                <div className="border border-gray-300 rounded p-4 bg-white text-gray-400">
                    Loading...
                </div>
            ) : (
                <div className="border border-gray-300 rounded p-4 bg-white">
                    <EditorContent editor={editor} />
                </div>
            )}
        </div>
    );
}
