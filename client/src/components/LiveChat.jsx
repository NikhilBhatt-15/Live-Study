import React, { useState, useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useAuth } from "../context/AuthContext"; // Assumes you have this

const LiveChat = ({ roomId, isCollapsed = false, onToggleCollapse }) => {
  const { user } = useAuth(); // token is JWT if logged in
  // token is in localStorage
  const token = localStorage.getItem("token");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  // Connect to WebSocket on mount
  useEffect(() => {
    // Build ws URL with or without token
    const wsUrl =
      token?.length > 0
        ? `ws://localhost:8000?roomId=${roomId}&token=${token}`
        : `ws://localhost:8000?roomId=${roomId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.error) return; // Optionally handle error
      setMessages((prev) => [...prev, msg]);
    };

    // Optionally: fetch initial chat history from REST API here

    return () => ws.close();
  }, [roomId, token]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // Optionally show a warning to the user
      alert("Chat connection lost. Please refresh or try again.");
      return;
    }
    ws.send(JSON.stringify({ content: newMessage }));
    setNewMessage("");
  };
  if (isCollapsed) {
    return (
      <button style={styles.collapseButton} onClick={onToggleCollapse}>
        <MessageSquare style={styles.icon} />
        <span>Open Chat</span>
      </button>
    );
  }

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        <div style={styles.chatHeaderLeft}>
          <MessageSquare style={styles.icon} />
          <h3 style={styles.chatTitle}>Live Chat</h3>
        </div>
        {onToggleCollapse && (
          <button style={styles.hideButton} onClick={onToggleCollapse}>
            Hide
          </button>
        )}
      </div>

      <div style={styles.chatMessages}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} {...msg} />
        ))}
      </div>

      <form onSubmit={handleSendMessage} style={styles.chatForm}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={user ? "Type a message..." : "Login to chat"}
          style={styles.input}
          disabled={!user}
        />
        <button
          type="submit"
          style={styles.sendButton}
          disabled={!user || !newMessage.trim()}
        >
          Send
        </button>
      </form>
      {!user && (
        <div style={{ color: "#ef4444", textAlign: "center", marginTop: 8 }}>
          Please log in to send messages.
        </div>
      )}
    </div>
  );
};

// ...styles unchanged
const styles = {
  collapseButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  icon: {
    width: "16px",
    height: "16px",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
  },
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #d1d5db",
    backgroundColor: "#f3f4f6",
  },
  chatHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  chatTitle: {
    fontSize: "16px",
    fontWeight: "500",
  },
  hideButton: {
    padding: "4px 8px",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },
  chatMessages: {
    flex: 1,
    padding: "12px",
    overflowY: "auto",
    backgroundColor: "#ffffff",
  },
  chatForm: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid #d1d5db",
  },
  input: {
    flex: 1,
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "14px",
  },
  sendButton: {
    padding: "8px 16px",
    fontSize: "14px",
    color: "#ffffff",
    backgroundColor: "#1d4ed8",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
export default LiveChat;
