import pool from "../config/connectDB.js";

const createSupplier = async (data) => {
  const { name, phone, email, address } = data;

  const [result] = await pool.query(
    `INSERT INTO suppliers (name, phone, email, address)
     VALUES (?, ?, ?, ?)`,
    [name, phone, email, address]
  );

  return result.insertId;
};

const getAllSuppliers = async () => {
  const [rows] = await pool.query(`SELECT * FROM suppliers ORDER BY id DESC`);
  return rows;
};

export default {
  createSupplier,
  getAllSuppliers,
};
