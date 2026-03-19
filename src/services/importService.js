import pool from "../config/connectDB.js";

const createImport = async ({ supplier_id, items }) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. tạo import
    const [importResult] = await conn.query(
      `INSERT INTO imports (supplier_id, created_at)
       VALUES (?, NOW())`,
      [supplier_id]
    );

    const importId = importResult.insertId;

    // 2. insert import_details + update stock
    for (const item of items) {
      const { book_id, quantity, price } = item;

      // insert detail
      await conn.query(
        `INSERT INTO import_details (import_id, book_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [importId, book_id, quantity, price]
      );

      // update stock
      await conn.query(`UPDATE books SET stock = stock + ? WHERE id = ?`, [
        quantity,
        book_id,
      ]);
    }

    await conn.commit();
    return importId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const getAllImports = async (page, limit) => {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT 
          i.*,
          s.id as supplier_id,
          s.name as supplier_name
       FROM imports i
       LEFT JOIN suppliers s ON i.supplier_id = s.id
       ORDER BY i.id DESC
       LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [totalRows] = await pool.query(`SELECT COUNT(*) as total FROM imports`);

  // 👉 transform lại data
  const imports = rows.map((row) => {
    const { supplier_id, supplier_name, ...rest } = row;

    return {
      ...rest,
      supplier: supplier_id
        ? {
            id: supplier_id,
            name: supplier_name,
          }
        : null,
    };
  });

  return {
    imports,
    total: totalRows[0].total,
  };
};

const getImportById = async (id) => {
  // 1. thông tin phiếu nhập
  const [importRows] = await pool.query(
    `SELECT i.*, s.name as supplier_name
       FROM imports i
       LEFT JOIN suppliers s ON i.supplier_id = s.id
       WHERE i.id = ?`,
    [id]
  );

  if (importRows.length === 0) return null;

  // 2. chi tiết nhập
  const [details] = await pool.query(
    `SELECT d.*, b.title as book_name
       FROM import_details d
       LEFT JOIN books b ON d.book_id = b.id
       WHERE d.import_id = ?`,
    [id]
  );

  return {
    import: importRows[0],
    details,
  };
};

export default {
  createImport,
  getAllImports,
  getImportById,
};
