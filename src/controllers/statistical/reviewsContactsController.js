import reviewsContactsService from "../../services/statistical/reviewsContactsService";

const getContactsOverview = async (req, res) => {
  try {
    const data = await reviewsContactsService.getContactsOverview();

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

const getReviewOverview = async (req, res) => {
  try {
    const data = await reviewsContactsService.getReviewOverview();

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
  getContactsOverview,
  getReviewOverview,
};
