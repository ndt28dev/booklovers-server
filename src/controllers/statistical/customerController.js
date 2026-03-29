import customerService from "../../services/statistical/customerService";

const getCustomerOverview = async (req, res) => {
  try {
    const data = await customerService.getCustomerOverview();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("❌ getCustomerOverview error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getCustomerCLV = async (req, res) => {
  try {
    const data = await customerService.getCustomerCLV();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("❌ getCustomerCLV error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default {
  getCustomerOverview,
  getCustomerCLV,
};
