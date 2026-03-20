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
  const [rows] = await pool.query(
    `SELECT * FROM suppliers WHERE is_hidden = 0 ORDER BY id DESC `
  );
  return rows;
};

const updateSupplier = async (id, data) => {
  const { name, phone, email, address } = data;

  const [result] = await pool.query(
    `UPDATE suppliers 
     SET name = ?, phone = ?, email = ?, address = ?
     WHERE id = ? AND is_hidden = 0`,
    [name, phone, email, address, id]
  );

  return result.affectedRows;
};

const deleteSupplier = async (id) => {
  const [result] = await pool.query(
    `UPDATE suppliers 
     SET is_hidden = 1 
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
};

export default {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
};
