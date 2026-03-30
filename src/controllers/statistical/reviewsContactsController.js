import reviewsContactsService from "../../services/statistical/reviewsContactsService";

const getFeedbackStats = async (req, res) => {
  try {
    const data = await reviewsContactsService.getFeedbackStats();

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

export default {
  getFeedbackStats,
};
