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
    console.error("Error fetching monthly revenue:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getRevenueStats,
  getRevenueGrowth,
};
