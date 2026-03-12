import pool from "../config/connectDB.js";

const getAllPromotions = async (limit, offset, discount_type, search) => {
  let query = `SELECT * FROM promotion WHERE  is_hidden = 0`;
  let countQuery = `SELECT COUNT(*) as total FROM promotion WHERE 1=1`;

  const params = [];
  const countParams = [];

  // filter discount_type
  if (discount_type) {
    query += ` AND discount_type = ?`;
    countQuery += ` AND discount_type = ?`;

    params.push(discount_type);
    countParams.push(discount_type);
  }

  // search
  if (search) {
    query += ` AND (code LIKE ? OR description LIKE ?)`;
    countQuery += ` AND (code LIKE ? OR description LIKE ?)`;

    const keyword = `%${search}%`;

    params.push(keyword, keyword);
    countParams.push(keyword, keyword);
  }

  query += ` ORDER BY id DESC LIMIT ? OFFSET ?`;

  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  const [countRows] = await pool.query(countQuery, countParams);

  return {
    promotions: rows,
    total: countRows[0].total,
  };
};

const getPromotionByCode = async (code) => {
  const [rows] = await pool.query(
    `SELECT * FROM promotion
     WHERE code = ?
     AND is_active = TRUE
     AND NOW() BETWEEN start_date AND end_date
     AND (usage_limit IS NULL OR used_count < usage_limit)`,
    [code]
  );

  return rows[0];
};

const createPromotion = async (data) => {
  const {
    code,
    description,
    discount_type,
    discount_value,
    start_date,
    end_date,
    usage_limit,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO promotion 
    (code, description, discount_type, discount_value, start_date, end_date, usage_limit)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      code,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      usage_limit,
    ]
  );

  return result.insertId;
};

const updatePromotion = async (data) => {
  const {
    id,
    code,
    description,
    discount_type,
    discount_value,
    start_date,
    end_date,
    usage_limit,
    is_active,
  } = data;

  const [result] = await pool.query(
    `UPDATE promotion
     SET code = ?, description = ?, discount_type = ?, discount_value = ?,
     start_date = ?, end_date = ?, usage_limit = ?, is_active = ?
     WHERE id = ?`,
    [
      code,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      usage_limit,
      is_active,
      id,
    ]
  );

  return result;
};

const deletePromotion = async (id) => {
  const [result] = await pool.query(
    `UPDATE promotion SET is_hidden = 1 WHERE id = ?`,
    [id]
  );

  return result;
};

export default {
  getPromotionByCode,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getAllPromotions,
};
