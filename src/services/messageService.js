import pool from "../config/connectDB.js";

const saveMessage = async (data) => {
  const { user_id, sender_type, message } = data;

  // 1. Lưu message
  const [result] = await pool.query(
    `INSERT INTO messages (user_id, sender_type, message)
     VALUES (?, ?, ?)`,
    [user_id, sender_type, message]
  );

  // 2. Lấy info user
  const [[user]] = await pool.query(
    `SELECT fullname, avatar FROM users WHERE id = ?`,
    [user_id]
  );

  if (sender_type === "user") {
    // noti cho admin
    await pool.query(
      `INSERT INTO notifications (user_id, title, content, type)
       VALUES (?, ?, ?, ?)`,
      [0, "Tin nhắn mới", `${user?.fullname}: ${message}`, "message"]
    );
  }

  if (sender_type === "admin") {
    // noti cho user
    await pool.query(
      `INSERT INTO notifications (user_id, title, content, type)
       VALUES (?, ?, ?, ?)`,
      [user_id, "Shop phản hồi", "Bạn có tin nhắn mới từ shop", "message"]
    );
  }

  // 4. return data cho socket
  return {
    id: result.insertId,
    user_id,
    sender_type,
    message,
    is_seen: false,
    created_at: new Date(),
    fullname: user?.fullname || "User",
    avatar: user?.avatar || "",
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
    SELECT 
      id,
      user_id,
      sender_type,
      message,
      is_seen,
      created_at
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
