import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { io } from "socket.io-client";
import throttle from "lodash/throttle";

export default function RoomEditor() {
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const [lastReceived, setLastReceived] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p></p>",
  });

  useEffect(() => {
    const apiUrl = "https://collab-text-whiteboard.onrender.com";
    socketRef.current = io(apiUrl);

    socketRef.current.emit("join-room", { roomId });

    socketRef.current.on("room-content", ({ content }) => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content, false);
        setLastReceived(content);
      }
    });

    socketRef.current.on("receive-changes", ({ content }) => {
      if (!editor) return;
      if (content !== editor.getHTML()) {
        const { state, view } = editor;
        const { from, to } = state.selection;
        editor.commands.setContent(content, false);
        view.dispatch(
          view.state.tr.setSelection(
            editor.state.tr.setSelection(
              editor.state.selection.constructor.create(
                editor.state.doc,
                from,
                to
              )
            )
          )
        );
        setLastReceived(content);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, editor]);

  useEffect(() => {
    if (!editor) return;

    const throttledEmit = throttle(() => {
      const html = editor.getHTML();
      if (html !== lastReceived) {
        socketRef.current.emit("send-changes", { roomId, content: html });
      }
    }, 300);

    editor.on("update", throttledEmit);

    return () => {
      throttledEmit.cancel();
    };
  }, [editor, roomId, lastReceived]);

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
