const productModel = require('../../models/productModel');

const filterProductController = async (req, res) => {
  try {
    const categoryList = req?.body?.category || []; // Get the category list from the request body

    const product = await productModel.find({
      category: { $in: categoryList }
    }); // Filter products based on the category list in the database

    return res.status(200).json({
      data: product,
      message: 'Products',
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
module.exports = filterProductController;