import pool from "../config/connectDB.js";

const getSystemSettings = async () => {
  const [rows] = await pool.query("SELECT * FROM system_settings WHERE id = 1");
  return rows[0] || null;
};

const updateSystemSettings = async (data) => {
  const {
    logo,
    hotline,
    email,
    address,
    zalo,
    facebook,
    instagram,
    tiktok,
    youtube,
  } = data;

  const [result] = await pool.query(
    `UPDATE system_settings SET 
      logo = ?, hotline = ?, email = ?, address = ?, zalo = ?, 
      facebook = ?, instagram = ?, tiktok = ?, youtube = ?,
      updated_at = NOW()
     WHERE id = 1`,
    [logo, hotline, email, address, zalo, facebook, instagram, tiktok, youtube]
  );

  return result;
};

export default {
  getSystemSettings,
  updateSystemSettings,
};
