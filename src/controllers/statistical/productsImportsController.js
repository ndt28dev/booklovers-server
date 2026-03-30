import productsImportsService from "../../services/statistical/productsImportsService";

const getProductsOverview = async (req, res) => {
  try {
    const data = await productsImportsService.getProductsOverview();

    return res.status(200).json({
      success: true,
      message: "Get products overview success",
      data,
    });
  } catch (error) {
    console.error("productsOverview error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default {
  getProductsOverview,
};
