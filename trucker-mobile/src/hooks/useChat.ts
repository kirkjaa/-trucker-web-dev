import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

// ============================================================================
// Types
// ============================================================================

export interface ChatParticipant {
  id: string;
  displayName: string;
  avatar: string | null;
}

export interface ChatConversation {
  id: string;
  type: "private" | "group";
  name: string | null;
  avatar: string | null;
  lastMessage: {
    content: string | null;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
  participants: ChatParticipant[];
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  messageType: string;
  attachmentUrl: string | null;
  isRead: boolean;
  createdAt: string;
  sender: ChatParticipant | null;
}

// ============================================================================
// Format Helpers
// ============================================================================

export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

// ============================================================================
// Conversations Hook
// ============================================================================

interface UseConversationsResult {
  conversations: ChatConversation[];
  companies: ChatConversation[];
  groups: ChatConversation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useConversations(): UseConversationsResult {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.chat.list();
      setConversations(data || []);
    } catch (err: any) {
      console.error("Failed to fetch conversations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Separate private (companies) and group conversations
  const companies = conversations.filter((c) => c.type === "private");
  const groups = conversations.filter((c) => c.type === "group");

  return {
    conversations,
    companies,
    groups,
    loading,
    error,
    refetch: fetchData,
  };
}

// ============================================================================
// Messages Hook
// ============================================================================

interface UseMessagesResult {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  sendMessage: (content: string) => Promise<void>;
}

export function useMessages(conversationId: string | null): UseMessagesResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.chat.getMessages(conversationId, { limit: 50 });
      setMessages(data || []);
    } catch (err: any) {
      console.error("Failed to fetch messages:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;

    try {
      const newMessage = await api.chat.sendMessage(conversationId, {
        content,
        messageType: "text",
      });
      setMessages((prev) => [...prev, newMessage]);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      throw err;
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    refetch: fetchData,
    sendMessage,
  };
}

// ============================================================================
// Transform for UI Components
// ============================================================================

export interface ChatThreadItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isTyping?: boolean;
  type: "private" | "group";
}

export function transformConversationToThread(conv: ChatConversation): ChatThreadItem {
  const defaultAvatar = "/assets/icons/chat-new/frame10.png";
  
  let name = conv.name;
  if (!name && conv.type === "private" && conv.participants.length > 0) {
    name = conv.participants[0]?.displayName || "Unknown";
  }
  name = name || "Conversation";

  const lastMessage = conv.lastMessage?.content || "No messages yet";
  const time = conv.lastMessage?.createdAt 
    ? formatMessageTime(conv.lastMessage.createdAt)
    : "";

  return {
    id: conv.id,
    name,
    avatar: conv.avatar || conv.participants[0]?.avatar || defaultAvatar,
    lastMessage,
    time,
    unreadCount: conv.unreadCount,
    type: conv.type,
  };
}

export interface ChatMessageItem {
  id: string;
  content: string;
  time: string;
  isMine: boolean;
  senderName: string;
  senderAvatar: string;
}

export function transformMessage(msg: ChatMessage, currentUserId: string): ChatMessageItem {
  return {
    id: msg.id,
    content: msg.content || "",
    time: formatMessageTime(msg.createdAt),
    isMine: msg.senderId === currentUserId,
    senderName: msg.sender?.displayName || "Unknown",
    senderAvatar: msg.sender?.avatar || "/assets/icons/chat-new/frame10.png",
  };
}

