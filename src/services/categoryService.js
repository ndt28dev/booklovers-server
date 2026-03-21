import pool from "../config/connectDB.js";

const getCategoriesWithSub = async () => {
  // Lấy tất cả category
  const [categories] = await pool.query(
    "SELECT * FROM categories WHERE is_hidden = 0"
  );

  // Lấy tất cả subcategory
  const [subcategories] = await pool.query(
    "SELECT * FROM subcategories WHERE is_hidden = 0"
  );

  // Gộp sub vào từng category tương ứng
  const result = categories.map((cat) => {
    const subs = subcategories.filter((sub) => sub.category_id === cat.id);
    return {
      ...cat,
      subcategories: subs,
    };
  });

  return result;
};

export default {
  getCategoriesWithSub,
};
