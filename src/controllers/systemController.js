import systemService from "../services/systemService";

const getSettings = async (req, res) => {
  try {
    const settings = await systemService.getSystemSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const data = req.body;
    await systemService.updateSystemSettings(data);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export default {
  getSettings,
  updateSettings,
};
