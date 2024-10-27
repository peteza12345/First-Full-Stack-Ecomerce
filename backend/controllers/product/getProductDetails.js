const productModel = require("../../models/productModel");

const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);

    return res.status(200).json({
      data: product,
      message: 'Ok',
      success: true,
      error: false
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || 'An error occurred',
      error: true,
      success: false
    });
  }
};

module.exports = getProductDetails;

