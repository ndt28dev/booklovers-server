import pool from "../../config/connectDB.js";

const formatDate = (date) => date.toISOString().split("T")[0];

// 👉 format dd/mm
const formatVN = (date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

// 👉 format mm/yyyy
const formatMonthYear = (date) =>
  `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

const calcGrowth = (current, previous) => {
  if (!previous) return 100;
  return (((current - previous) / previous) * 100).toFixed(1);
};

const getRevenueStats = async () => {
  const now = new Date();

  // ===== DAY =====
  const today = new Date(now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  // ===== WEEK =====
  const dayOfWeek = now.getDay() || 7;

  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek + 1);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const prevStart = new Date(start);
  prevStart.setDate(start.getDate() - 7);

  const prevEnd = new Date(end);
  prevEnd.setDate(end.getDate() - 7);

  // ===== MONTH =====
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const prevMonthDate = new Date(year, month - 2, 1);

  // ===== QUERY =====
  const [dayCurrent] = await pool.query(
    `SELECT SUM(total_price) as revenue FROM orders 
     WHERE DATE(order_date)=? AND status='delivered'`,
    [formatDate(today)]
  );

  const [dayPrev] = await pool.query(
    `SELECT SUM(total_price) as revenue FROM orders 
     WHERE DATE(order_date)=? AND status='delivered'`,
    [formatDate(yesterday)]
  );

  const [weekCurrent] = await pool.query(
    `SELECT SUM(total_price) as revenue FROM orders 
     WHERE DATE(order_date) BETWEEN ? AND ? AND status='delivered'`,
    [formatDate(start), formatDate(end)]
  );

  const [weekPrev] = await pool.query(
    `SELECT SUM(total_price) as revenue FROM orders 
     WHERE DATE(order_date) BETWEEN ? AND ? AND status='delivered'`,
    [formatDate(prevStart), formatDate(prevEnd)]
  );

  const [monthCurrent] = await pool.query(
    `SELECT SUM(total_price) as revenue FROM orders 
     WHERE MONTH(order_date)=? AND YEAR(order_date)=? AND status='delivered'`,
    [month, year]
  );

  const [monthPrev] = await pool.query(
    `SELECT SUM(total_price) as revenue FROM orders 
     WHERE MONTH(order_date)=? AND YEAR(order_date)=? AND status='delivered'`,
    [prevMonthDate.getMonth() + 1, prevMonthDate.getFullYear()]
  );

  const [yearCurrent] = await pool.query(
    `SELECT SUM(total_price) as revenue FROM orders 
     WHERE YEAR(order_date)=? AND status='delivered'`,
    [year]
  );

  const [yearPrev] = await pool.query(
    `SELECT SUM(total_price) as revenue FROM orders 
     WHERE YEAR(order_date)=? AND status='delivered'`,
    [year - 1]
  );

  // ===== RETURN =====
  return {
    day: {
      label: formatVN(today), // 👉 27/03
      current: dayCurrent[0].revenue || 0,
      previous: dayPrev[0].revenue || 0,
      growth: calcGrowth(dayCurrent[0].revenue || 0, dayPrev[0].revenue || 0),
    },

    week: {
      label: `${formatVN(start)} - ${formatVN(end)}`, // 👉 23/03 - 29/03
      current: weekCurrent[0].revenue || 0,
      previous: weekPrev[0].revenue || 0,
      growth: calcGrowth(weekCurrent[0].revenue || 0, weekPrev[0].revenue || 0),
    },

    month: {
      label: formatMonthYear(now), // 👉 03/2026
      current: monthCurrent[0].revenue || 0,
      previous: monthPrev[0].revenue || 0,
      growth: calcGrowth(
        monthCurrent[0].revenue || 0,
        monthPrev[0].revenue || 0
      ),
    },

    year: {
      label: `${year}`, // 👉 2026
      current: yearCurrent[0].revenue || 0,
      previous: yearPrev[0].revenue || 0,
      growth: calcGrowth(yearCurrent[0].revenue || 0, yearPrev[0].revenue || 0),
    },
  };
};

const getRevenueGrowth = async (year) => {
  const [monthlyRevenueRows] = await pool.query(
    `
      SELECT MONTH(order_date) AS month, SUM(total_price) AS total
      FROM orders
      WHERE status = 'delivered' AND YEAR(order_date) = ?
      GROUP BY MONTH(order_date)
      ORDER BY MONTH(order_date)
      `,
    [year]
  );
  if (monthlyRevenueRows.length === 0) {
    return [];
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = monthNames.map((month, index) => {
    const found = monthlyRevenueRows.find((row) => row.month === index + 1);
    return { name: month, value: found ? Number(found.total) : 0 };
  });

  return chartData;
};

export default {
  getRevenueStats,
  getRevenueGrowth,
};
