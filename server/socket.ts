import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { createMessage, getConsultationMessages } from "./db";

interface ConnectedUser {
  userId: number;
  consultationId: number;
  socketId: string;
}

const connectedUsers: Map<string, ConnectedUser> = new Map();

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins a consultation room
    socket.on("join-consultation", async (data: { consultationId: number; userId: number }) => {
      const { consultationId, userId } = data;
      const roomName = `consultation-${consultationId}`;

      socket.join(roomName);
      connectedUsers.set(socket.id, { userId, consultationId, socketId: socket.id });

      // Notify others that user joined
      socket.to(roomName).emit("user-joined", {
        userId,
        timestamp: new Date(),
        message: `المستخدم ${userId} انضم إلى الاستشارة`,
      });

      // Send previous messages
      try {
        const messages = await getConsultationMessages(consultationId);
        socket.emit("previous-messages", messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    // Handle incoming messages
    socket.on("send-message", async (data: { consultationId: number; recipientId: number; content: string; senderId: number }) => {
      const { consultationId, recipientId, content, senderId } = data;
      const roomName = `consultation-${consultationId}`;

      try {
        // Save message to database
        const message = await createMessage({
          consultationId,
          senderId,
          recipientId,
          content,
        });

        // Broadcast message to all users in the room
        io.to(roomName).emit("new-message", {
          id: message.id,
          senderId,
          content,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("message-error", { error: "Failed to send message" });
      }
    });

    // Handle typing indicator
    socket.on("typing", (data: { consultationId: number; userId: number; isTyping: boolean }) => {
      const { consultationId, userId, isTyping } = data;
      const roomName = `consultation-${consultationId}`;

      socket.to(roomName).emit("user-typing", {
        userId,
        isTyping,
      });
    });

    // Handle user status
    socket.on("set-status", (data: { consultationId: number; userId: number; status: "online" | "offline" }) => {
      const { consultationId, userId, status } = data;
      const roomName = `consultation-${consultationId}`;

      io.to(roomName).emit("user-status", {
        userId,
        status,
        timestamp: new Date(),
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        const roomName = `consultation-${user.consultationId}`;
        socket.to(roomName).emit("user-left", {
          userId: user.userId,
          timestamp: new Date(),
          message: `المستخدم ${user.userId} غادر الاستشارة`,
        });
        connectedUsers.delete(socket.id);
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getConnectedUsers(consultationId: number) {
  const users: ConnectedUser[] = [];
  connectedUsers.forEach((user) => {
    if (user.consultationId === consultationId) {
      users.push(user);
    }
  });
  return users;
}
