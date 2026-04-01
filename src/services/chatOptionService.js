import pool from "../config/connectDB.js";

const getAllOptions = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  // lấy data
  const [rows] = await pool.query(
    `SELECT id, question, answer, category
       FROM chat_options
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );

  // đếm total
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
