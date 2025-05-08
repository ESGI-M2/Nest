"use client"

import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "@/lib/api";

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL);
    const userJson = window.localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (user?.id) {
      api.get(`/chat/${user.id}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setMessages(response.data);
          }
        })
        .catch((err) => console.error("Erreur récupération messages :", err));
    }

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    const userJson = window.localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const { id } = user || null;

    if (!newMessage.trim() || !id) return;
    const socket = io(process.env.NEXT_PUBLIC_API_URL);
    socket.emit("message", { content: newMessage, sender: id });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border shadow rounded">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-gray-200 p-2 rounded max-w-xs">
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex items-center p-4 border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Écris un message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chat;
