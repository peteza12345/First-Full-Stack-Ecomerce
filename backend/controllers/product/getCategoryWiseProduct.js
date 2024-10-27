const productModel = require("../../models/productModel");

const getCategoryWiseProduct = async (req, res) => {
  try {
    const { category } = req?.body || req?.query;
    const product = await productModel.find({ category });

    return res.status(200).json({
      data: product,
      message: 'Products',
      success: true,
      error: false
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'An error occurred',
      error: true,
      success: false
    });
  }
};

module.exports = getCategoryWiseProduct;