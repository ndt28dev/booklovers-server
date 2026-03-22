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

    let logo = data.logo || null;
    if (req.file) {
      logo = `${req.file.filename}`;
    }

    await systemService.updateSystemSettings({ ...data, logo });
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
