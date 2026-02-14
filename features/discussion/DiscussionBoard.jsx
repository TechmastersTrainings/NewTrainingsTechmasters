import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import "./Discussion.css";

export default function DiscussionBoard({ classId }) {
  const { userId, fullName, roleName } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    loadMessages();
  }, [classId]);

  const loadMessages = async () => {
    try {
      const res = await api.get(`/discussions/class/${classId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    try {
      await api.post("/discussions/post", {
        classId,
        senderId: userId,
        senderName: fullName,
        message: newMsg,
      });
      setNewMsg("");
      loadMessages();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="discussion-container fade-in">
      <h2>Classroom Discussion</h2>
      <div className="discussion-box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.senderId === userId ? "sent" : "received"
            }`}
          >
            <div className="sender">{msg.senderName}</div>
            <div className="text">{msg.message}</div>
            <div className="time">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
