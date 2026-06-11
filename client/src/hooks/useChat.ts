import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: Date;
}

interface UseChatsOptions {
  consultationId: number;
  userId: number;
  onMessageReceived?: (message: Message) => void;
  onUserTyping?: (data: { userId: number; isTyping: boolean }) => void;
  onUserStatusChange?: (data: { userId: number; status: "online" | "offline" }) => void;
}

export function useChat(options: UseChatsOptions) {
  const { consultationId, userId, onMessageReceived, onUserTyping, onUserStatusChange } = options;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(window.location.origin, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
      newSocket.emit("join-consultation", { consultationId, userId });
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    newSocket.on("previous-messages", (previousMessages: Message[]) => {
      setMessages(previousMessages);
    });

    newSocket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      onMessageReceived?.(message);
    });

    newSocket.on("user-typing", (data: { userId: number; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
      onUserTyping?.(data);
    });

    newSocket.on("user-status", (data: { userId: number; status: "online" | "offline" }) => {
      onUserStatusChange?.(data);
    });

    newSocket.on("message-error", (error: any) => {
      console.error("Message error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [consultationId, userId, onMessageReceived, onUserTyping, onUserStatusChange]);

  const sendMessage = useCallback(
    (content: string, recipientId: number) => {
      if (socket && isConnected) {
        socket.emit("send-message", {
          consultationId,
          recipientId,
          content,
          senderId: userId,
        });
      }
    },
    [socket, isConnected, consultationId, userId]
  );

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (socket && isConnected) {
        socket.emit("typing", {
          consultationId,
          userId,
          isTyping,
        });
      }
    },
    [socket, isConnected, consultationId, userId]
  );

  const setStatus = useCallback(
    (status: "online" | "offline") => {
      if (socket && isConnected) {
        socket.emit("set-status", {
          consultationId,
          userId,
          status,
        });
      }
    },
    [socket, isConnected, consultationId, userId]
  );

  return {
    messages,
    isConnected,
    typingUsers,
    sendMessage,
    setTyping,
    setStatus,
  };
}
