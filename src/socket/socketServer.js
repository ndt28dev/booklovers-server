import { Server } from "socket.io";
import messageService from "../services/messageService";

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // join room theo userId
    socket.on("join_room", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // gửi tin nhắn realtime
    socket.on("send_message", async (data) => {
      // data: { userId, senderType, message }

      const saved = await saveMessage(data);

      // gửi lại cho user
      io.to(data.userId).emit("receive_message", saved);

      // gửi cho admin
      io.to("admin_room").emit("receive_message", saved);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

// để dùng ở controller/service nếu cần
const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

export { initSocket, getIO };
