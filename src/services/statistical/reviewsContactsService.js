import pool from "../../config/connectDB.js";

const getContactsOverview = async () => {
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

const getReviewOverview = async () => {
  const [rows] = await pool.query(`
        SELECT 
          COUNT(*) AS total_reviews,
          COALESCE(ROUND(AVG(rating), 1), 0) AS avg_rating,
  
          SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS star_5,
          SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS star_4,
          SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS star_3,
          SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS star_2,
          SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS star_1
  
        FROM reviews
        WHERE is_hidden = 0
      `);

  return rows[0];
};

const getTopBooksMostReviews = async (limit = 5, year) => {
  const [rows] = await pool.query(
    `
      SELECT 
        b.id,
        b.name,
        b.price,
        c.name AS category_name,
        sc.name AS subcategory_name,
        COUNT(r.id) AS total_reviews
      FROM books b
      LEFT JOIN categories c ON c.id = b.category_id
      LEFT JOIN subcategories sc ON sc.id = b.subcategory_id
      LEFT JOIN reviews r 
        ON r.product_id = b.id 
        AND r.is_hidden = 0
      WHERE (? IS NULL OR YEAR(r.created_at) = ?)
      GROUP BY b.id, c.name, sc.name
      ORDER BY total_reviews DESC
      LIMIT ?
      `,
    [year || null, year || null, Number(limit)]
  );

  return rows;
};

export default {
  getContactsOverview,
  getReviewOverview,
  getTopBooksMostReviews,
};
