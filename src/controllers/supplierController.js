import supplierService from "../services/supplierService.js";

const createSupplier = async (req, res) => {
  try {
    const id = await supplierService.createSupplier(req.body);

    res.status(201).json({
      message: "Tạo nhà cung cấp thành công",
      id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const data = await supplierService.getAllSuppliers();

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
  createSupplier,
  getAllSuppliers,
};
