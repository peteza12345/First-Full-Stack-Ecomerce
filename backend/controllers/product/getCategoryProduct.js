const productModel = require("../../models/productModel");

const getCategoryProduct = async (req, res) => {
  try {
    const productCategory = await productModel.distinct('category');

    // console.log('category', productCategory);
    const productByCategory = [];
    // array to store one product each category
    for (const category of productCategory) {
      const product = await productModel.findOne({ category });

      if (product) {
        productByCategory.push(product);
      }

    }

    return res.status(200).json({
      message: 'All Product',
      success: true,
      error: false,
      data: productByCategory
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || 'An error occurred',
      error: true,
      success: false
    });
  }
}

module.exports = getCategoryProduct;