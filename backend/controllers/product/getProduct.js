const productModel = require("../../models/productModel");

async function getProductController(req, res) {
  try {
    const allProduct = await productModel.find().sort({ createAt: -1 });

    return res.status(200).json({
      message: 'All Product',
      success: true,
      error: false,
      data: allProduct
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || 'An error occurred',
      error: true,
      success: false
    });
  }
}

module.exports = getProductController;