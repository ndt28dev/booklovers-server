import pool from "../../config/connectDB.js";

const getCustomerOverview = async () => {
  // Tổng khách
  const [[totalCustomers]] = await pool.query(`
    SELECT COUNT(*) AS total FROM users
  `);

  // 🆕 Khách mới (30 ngày)
  const [[newCustomers]] = await pool.query(`
    SELECT COUNT(*) AS total 
    FROM users
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  `);

  // 🔁 Khách quay lại (>= 2 đơn)
  const [[returningCustomers]] = await pool.query(`
    SELECT COUNT(*) AS total FROM (
      SELECT user_id
      FROM orders
      GROUP BY user_id
      HAVING COUNT(*) >= 2
    ) t
  `);

  // 💸 AOV
  const [[aov]] = await pool.query(`
    SELECT 
      IFNULL(SUM(total_price) / COUNT(*), 0) AS value
    FROM orders
  `);

  return {
    totalCustomers: totalCustomers.total,
    newCustomers: newCustomers.total,
    returningCustomers: returningCustomers.total,
    aov: Math.round(aov.value || 0),
  };
};

export default {
  getCustomerOverview,
};
