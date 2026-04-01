import pool from "../config/connectDB.js";

const getAllOptions = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT 
          co.id,
          co.question,
          co.answer,
          co.category_id,
          cc.name AS category_name
       FROM chat_options co
       LEFT JOIN chat_categories cc ON co.category_id = cc.id
       WHERE co.is_hidden = 0
       ORDER BY co.id DESC
       LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  const [countResult] = await pool.query(
    `SELECT COUNT(*) as total FROM chat_options`
  );

  const total = countResult[0].total;

  return {
    data: rows,
    total,
  };
};

const getAnswerById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, question, answer FROM chat_options WHERE id = ?",
    [id]
  );

  return rows[0] || null;
};

export default {
  getAllOptions,
  getAnswerById,
};
