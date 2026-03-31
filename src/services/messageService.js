import pool from "../config/connectDB.js";

// CREATE TABLE messages (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id VARCHAR(50) NOT NULL,       -- user chat
//     sender_type ENUM('user', 'admin') NOT NULL,
//     message TEXT NOT NULL,
//     is_seen BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );

export const saveMessage = async (data) => {
  const { userId, senderType, message } = data;

  const [result] = await pool.query(
    `INSERT INTO messages (user_id, sender_type, message)
       VALUES (?, ?, ?)`,
    [userId, senderType, message]
  );

  return {
    id: result.insertId,
    userId,
    senderType,
    message,
    isSeen: false,
    createdAt: new Date(),
  };
};

const getChatUsers = async () => {
  const [rows] = await pool.query(
    `
      SELECT 
        u.id,
        u.fullname,
        u.avatar,
  
        m.is_seen as is_seen,
        m.message as last_message,
        m.sender_type as last_sender,
        m.created_at as last_time
  
      FROM messages m
      JOIN users u ON u.id = m.user_id
  
      WHERE m.created_at = (
        SELECT MAX(m2.created_at)
        FROM messages m2
        WHERE m2.user_id = m.user_id
      )
  
      ORDER BY m.created_at DESC
      `
  );

  return rows;
};

const getMessagesByUser = async (userId) => {
  const [rows] = await pool.query(
    `
      SELECT *
      FROM messages
      WHERE user_id = ?
      ORDER BY created_at ASC
      `,
    [userId]
  );

  return rows;
};

export default {
  saveMessage,
  getChatUsers,
  getMessagesByUser,
};
