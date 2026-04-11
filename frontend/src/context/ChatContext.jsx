import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hello! I'm your DSA Assistant. Ask me anything 🚀",
  timestamp: new Date().toISOString(),
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);

  const [systemMessage, setSystemMessage] = useState("Explain simply.");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // FETCH CHATS
  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        const res = await api.get('/chat');
        setChats(res.data);

        if (res.data.length > 0) {
          setCurrentChatId(res.data[0]._id);
          setMessages(res.data[0].messages || [WELCOME_MESSAGE]);
        } else {
          createNewChat();
        }
      } catch (err) {
        console.error("Fetch chats error:", err);
      }
    };

    fetchChats();
  }, [user]);

  // SWITCH CHAT
  const switchChat = (chatId) => {
    if (chatId === currentChatId) return;

    setCurrentChatId(chatId);
    const chat = chats.find(c => c._id === chatId);

    if (chat) {
      setMessages(chat.messages.length ? chat.messages : [WELCOME_MESSAGE]);
    }
  };

  // SEND MESSAGE (FIXED)
  const sendMessage = async (text) => {
    if (isLoading || !user) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Optimistic UI
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await api.post('/chat', {
        chatId: currentChatId,
        message: userMessage, // ✅ FIXED (single message)
        systemPrompt: systemMessage,
      });

      const updatedChat = res.data.chat;

      // Update chat list
      setChats(prev => {
        const exists = prev.find(c => c._id === updatedChat._id);
        if (exists) {
          return prev.map(c => c._id === updatedChat._id ? updatedChat : c);
        } else {
          return [updatedChat, ...prev];
        }
      });

      setCurrentChatId(updatedChat._id);
      setMessages(updatedChat.messages);

    } catch (err) {
      setError("Failed to send message");

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Error occurred" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW CHAT
  const createNewChat = () => {
    setCurrentChatId(null);
    setMessages([WELCOME_MESSAGE]);
  };

  // DELETE CHAT
  const deleteChat = async (id) => {
    try {
      await api.delete(`/chat/${id}`);

      const updated = chats.filter(c => c._id !== id);
      setChats(updated);

      if (currentChatId === id) {
        if (updated.length > 0) {
          setCurrentChatId(updated[0]._id);
          setMessages(updated[0].messages);
        } else {
          createNewChat();
        }
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // DELETE ALL HISTORY
  const deleteAllHistory = async () => {
    try {
      await api.delete('/chat/all');
      setChats([]);
      setCurrentChatId(null);
      setMessages([WELCOME_MESSAGE]);
    } catch (err) {
      console.error("Delete all history failed", err);
    }
  };

  // TOGGLE SHARING
  const toggleChatSharing = async (id) => {
    try {
      const res = await api.patch(`/chat/${id}/share`);
      
      setChats(prev => prev.map(c => 
        c._id === id ? { ...c, isPublic: res.data.isPublic, shareableId: res.data.shareableId } : c
      ));
      
      return res.data;
    } catch (err) {
      console.error("Toggle sharing failed", err);
      throw err;
    }
  };

  // PIN CHAT
  const togglePin = (id) => {
    setChats(prev =>
      prev.map(c => c._id === id ? { ...c, pinned: !c.pinned } : c)
    );
  };

  return (
    <ChatContext.Provider value={{
      chats,
      currentChatId,
      switchChat,
      createNewChat,
      deleteChat,
      deleteAllHistory,
      toggleChatSharing,
      togglePin,
      messages,
      sendMessage,
      systemMessage,
      setSystemMessage,
      isLoading,
      error,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);