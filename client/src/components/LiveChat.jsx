import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import ChatMessage from "./ChatMessage";

const LiveChat = ({ isCollapsed = false, onToggleCollapse }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      username: "Professor Smith",
      message: "Welcome to today's session on Advanced Mathematics!",
      timestamp: "2:30 PM",
      isTeacher: true,
      avatar: "https://i.pravatar.cc/150?img=68",
    },
    {
      username: "John",
      message:
        "Hi Professor! Looking forward to learning about differential equations.",
      timestamp: "2:31 PM",
      avatar: "https://i.pravatar.cc/150?img=33",
    },
    {
      username: "Emma",
      message: "Could you explain the practical applications of today's topic?",
      timestamp: "2:32 PM",
      avatar: "https://i.pravatar.cc/150?img=23",
    },
    {
      username: "Professor Smith",
      message:
        "Great question Emma! We'll cover that in the second half of today's lecture.",
      timestamp: "2:33 PM",
      isTeacher: true,
      avatar: "https://i.pravatar.cc/150?img=68",
    },
    {
      username: "Alex",
      message: "Is this going to be on the exam?",
      timestamp: "2:34 PM",
      avatar: "https://i.pravatar.cc/150?img=57",
    },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newChatMessage = {
        username: "You",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "https://i.pravatar.cc/150?img=11",
      };

      setMessages([...messages, newChatMessage]);
      setNewMessage("");
    }
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
          <h3 style={styles.chatTitle}>Live Choooot</h3>
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
          placeholder="Type a message..."
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
};

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
