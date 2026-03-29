import pool from "../../config/connectDB.js";

const getCustomerOverview = async () => {
  // Tổng khách
  const [[totalCustomers]] = await pool.query(`
    SELECT COUNT(*) AS total FROM users
  `);

  //  Khách mới (30 ngày)
  const [[newCustomers]] = await pool.query(`
    SELECT COUNT(*) AS total 
    FROM users
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  `);

  //  Khách quay lại (>= 2 đơn)
  const [[returningCustomers]] = await pool.query(`
    SELECT COUNT(*) AS total FROM (
      SELECT user_id
      FROM orders
      GROUP BY user_id
      HAVING COUNT(*) >= 2
    ) t
  `);

  //  AOV
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

const getCustomerCLV = async () => {
  //  CLV trung bình
  const [[avgCLV]] = await pool.query(`
      SELECT IFNULL(AVG(total_spent), 0) AS value
      FROM (
        SELECT user_id, SUM(total_price) AS total_spent
        FROM orders
        GROUP BY user_id
      ) t
    `);

  //  CLV cao nhất
  const [[maxCLV]] = await pool.query(`
      SELECT u.fullname, SUM(o.total_price) AS total_spent
      FROM orders o
      JOIN users u ON u.id = o.user_id
      GROUP BY o.user_id
      ORDER BY total_spent DESC
      LIMIT 1
    `);

  //  Top 2 đơn hàng lớn nhất
  const [topOrders] = await pool.query(`
      SELECT u.fullname, o.total_price
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.total_price DESC
      LIMIT 2
    `);

  return {
    avgCLV: Math.round(avgCLV.value || 0),

    maxCLV: maxCLV?.total_spent || 0,
    topCustomerName: maxCLV?.fullname || "",

    maxOrder: topOrders[0] || null,
    secondMaxOrder: topOrders[1] || null,
  };
};

const getTopCustomersByYear = async (year, limit = 5) => {
  const [rows] = await pool.query(
    `
      SELECT 
      u.id AS user_id,
      u.fullname,
    
      SUM(o.total_price) AS total_spent,
      COUNT(o.id) AS total_orders,
    
      MAX(o.order_date) AS last_order_date,
      MIN(o.order_date) AS first_order_date,
    
      SUM(o.total_price) / COUNT(o.id) AS avg_order_value,
    
      CASE 
        WHEN SUM(o.total_price) > 1000000 THEN 'VIP'
        WHEN SUM(o.total_price) > 500000 THEN 'LOYAL'
        ELSE 'NEW'
      END AS customer_type
    
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE YEAR(o.order_date) = ?
        AND o.status = 'delivered'
      GROUP BY u.id, u.fullname, u.email, u.phone
      ORDER BY total_spent DESC
      LIMIT ?
    `,
    [year, Number(limit)]
  );

  return rows;
};

export default {
  getCustomerOverview,
  getCustomerCLV,
  getTopCustomersByYear,
};
