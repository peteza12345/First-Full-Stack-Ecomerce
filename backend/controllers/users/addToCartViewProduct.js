const addToCartModel = require("../../models/cartProduct");

const addToCartViewProduct = async (req, res) => {
  try {
    const currentUser = req.userId; // Get the user ID from the request
    // Find all products in the cart for the current user
    const allProduct = await addToCartModel.find({
      userId: currentUser
    }).populate('productId');

    return res.status(200).json({
      data: allProduct,
      message: 'ok',
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

module.exports = addToCartViewProduct;