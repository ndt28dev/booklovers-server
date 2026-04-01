import { Server } from "socket.io";
import messageService from "../services/messageService";

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
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
      try {
        // data: { user_id, sender_type, message }

        const saved = await messageService.saveMessage(data);

        // gửi cho user
        io.to(data.user_id).emit("receive_message", saved);

        // gửi cho admin
        io.to("admin_room").emit("receive_message", saved);

        io.to("admin_room").emit("receive_notification", {
          id: newId,
          user_id: 0,
          title: "Tin nhắn mới",
          content: `${user.fullname}: ${message}`,
          type: "message",
          is_read: 0,
          created_at: new Date(),
        });
      } catch (error) {
        socket.emit("error_message", {
          message: "Gửi tin nhắn thất bại",
        });
      }
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

// import { Server } from "socket.io";
// import messageService from "../services/messageService";

// let io;

// const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: process.env.CLIENT_URL,
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     // join room theo userId
//     socket.on("join_room", (userId) => {
//       socket.join(userId);
//     });

//     // gửi tin nhắn realtime
//     socket.on("send_message", async (data) => {
//       try {
//         const saved = await messageService.saveMessage(data);

//         // gửi lại cho user
//         io.to(data.userId).emit("receive_message", saved);

//         // gửi cho admin
//         io.to("admin_room").emit("receive_message", saved);
//       } catch (error) {
//         socket.emit("error_message", {
//           message: "Gửi tin nhắn thất bại",
//         });
//       }
//     });

//     socket.on("disconnect", () => {});
//   });

//   return io;
// };

// // để dùng ở controller/service nếu cần
// const getIO = () => {
//   if (!io) throw new Error("Socket not initialized");
//   return io;
// };

// export { initSocket, getIO };
