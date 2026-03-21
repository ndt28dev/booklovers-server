import importService from "../services/importService.js";

const createImport = async (req, res) => {
  try {
    const { supplier_id, total_amount, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm nhập" });
    }

    const importId = await importService.createImport({
      supplier_id,
      total_amount,
      items,
    });

    res.status(201).json({
      message: "Nhập hàng thành công",
      importId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi nhập hàng" });
  }
};

const getAllImports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await importService.getAllImports(page, limit);

    res.status(200).json({
      status: "OK",
      data: result.imports,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getImportById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await importService.getImportById(id);

    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập" });
    }

    res.status(200).json({
      status: "OK",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export default {
  createImport,
  getAllImports,
  getImportById,
};
