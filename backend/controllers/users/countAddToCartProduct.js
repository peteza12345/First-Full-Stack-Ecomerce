const addToCartModel = require("../../models/cartProduct");

const countAddToCartProduct = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required',
        error: true,
        success: false
      });
    }

    const count = await addToCartModel.countDocuments({ userId: userId });

    return res.status(200).json({
      data: {
        count: count
      },
      message: 'ok',
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

module.exports = countAddToCartProduct;