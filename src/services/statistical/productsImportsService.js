import pool from "../../config/connectDB.js";

const getProductsOverview = async () => {
  const [rows] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM books WHERE is_hidden = 0) AS total_products,

      -- tổng số lượng sách đã bán
      (SELECT COALESCE(SUM(oi.quantity), 0)
       FROM order_items oi
       JOIN books b ON b.id = oi.book_id
       WHERE b.is_hidden = 0
      ) AS total_sold_quantity,

      -- số sách đã từng được bán
      (SELECT COUNT(DISTINCT oi.book_id)
       FROM order_items oi
       JOIN books b ON b.id = oi.book_id
       WHERE b.is_hidden = 0
      ) AS sold_books,

      -- số sách chưa từng được bán
      (
        (SELECT COUNT(*) FROM books WHERE is_hidden = 0)
        -
        (SELECT COUNT(DISTINCT oi.book_id)
         FROM order_items oi
         JOIN books b ON b.id = oi.book_id
         WHERE b.is_hidden = 0
        )
      ) AS unsold_books
  `);

  return rows[0];
};

export default {
  getProductsOverview,
};
