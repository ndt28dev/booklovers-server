import pool from "../../config/connectDB.js";

const getFeedbackStats = async () => {
  const [rows] = await pool.query(`
      SELECT status, COUNT(*) as total
      FROM contacts
      GROUP BY status
    `);

  const result = {
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
  };

  rows.forEach((item) => {
    result.total += Number(item.total);

    if (item.status === "pending") result.pending = item.total;
    if (item.status === "in_progress") result.in_progress = item.total;
    if (item.status === "resolved") result.resolved = item.total;
  });

  return result;
};

export default {
  getFeedbackStats,
};
