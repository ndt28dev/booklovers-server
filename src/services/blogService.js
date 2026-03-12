import pool from "../config/connectDB.js";

const getAllBlogsPage = async (limit, offset, is_featured, search) => {
  let query = `SELECT * FROM blogs WHERE is_hidden = 0`;
  let countQuery = `SELECT COUNT(*) as total FROM blogs WHERE is_hidden = 0`;

  const params = [];
  const countParams = [];

  // filter featured
  if (is_featured !== undefined) {
    query += ` AND is_featured = ?`;
    countQuery += ` AND is_featured = ?`;

    params.push(is_featured);
    countParams.push(is_featured);
  }

  // search
  if (search) {
    query += ` AND (title LIKE ? OR description LIKE ?)`;
    countQuery += ` AND (title LIKE ? OR description LIKE ?)`;

    const keyword = `%${search}%`;

    params.push(keyword, keyword);
    countParams.push(keyword, keyword);
  }

  query += ` ORDER BY date DESC LIMIT ? OFFSET ?`;

  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  const [countRows] = await pool.query(countQuery, countParams);

  return {
    blogs: rows,
    total: countRows[0].total,
  };
};

const getFeaturedBlogs = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM blogs WHERE is_featured = 1 ORDER BY date DESC"
  );
  return rows;
};

// Lấy blog theo ID
const getBlogById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows[0] || null;
};

// Tạo blog mới
const createBlog = async (data) => {
  const { title, description, image, author, is_featured } = data;

  const [result] = await pool.query(
    `INSERT INTO blogs (title, description, image, author, date, is_featured)
     VALUES (?, ?, ?, ?, CURDATE(), ?)`,
    [title, description, image, author, is_featured]
  );

  return await getBlogById(result.insertId);
};

// Cập nhật blog
const updateBlog = async (data) => {
  const { title, description, image, author, is_featured, id } = data;

  if (image) {
    await pool.query(
      `UPDATE blogs 
       SET title = ?, description = ?, image = ?, author = ?, is_featured = ?
       WHERE id = ?`,
      [title, description, image, author, is_featured, id]
    );
  } else {
    await pool.query(
      `UPDATE blogs 
       SET title = ?, description = ?, author = ?, is_featured = ?
       WHERE id = ?`,
      [title, description, author, is_featured, id]
    );
  }

  return await getBlogById(id);
};
// Xóa blog
const deleteBlog = async (id) => {
  const blog = await getBlogById(id);
  if (!blog) return null;

  await pool.query("UPDATE blogs SET is_hidden = 1 WHERE id = ?", [id]);

  return blog;
};

export default {
  getAllBlogsPage,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
};
