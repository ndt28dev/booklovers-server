import orderService from "../../services/statistical/orderService";

const getRevenueStats = async (req, res) => {
  try {
    const data = await orderService.getRevenueStats();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error getting revenue statistics",
    });
  }
};

const getRevenueGrowth = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const data = await orderService.getRevenueGrowth(year);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Error fetching:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderStatusOverview = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Thiếu năm" });
    }

    const data = await orderService.getOrderStatusOverview(year);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Lỗi thống kê:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getRevenueByCategory = async (req, res) => {
  try {
    const { year } = req.query;

    const data = await orderService.getRevenueByCategoryService(year);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error getRevenueByCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getTodayDashboard = async (req, res) => {
  try {
    const data = await orderService.getTodayDashboard();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

const getTopOrdersByYear = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), page = 1, limit = 10 } = req.query;

    const result = await orderService.getTopOrdersByYear(year, page, limit);

    return res.json({
      success: true,
      data: result.data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (err) {
    console.error("getTopOrdersByYear error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default {
  getRevenueStats,
  getRevenueGrowth,
  getOrderStatusOverview,
  getRevenueByCategory,
  getTodayDashboard,
  getTopOrdersByYear,
};
