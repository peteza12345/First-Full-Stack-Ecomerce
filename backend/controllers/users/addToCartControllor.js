const addToCartModel = require("../../models/cartProduct");

const addToCartControllor = async (req, res) => {
  try {
    const { productId } = req?.body;
    const currentUser = req.userId;
    const isProductAvailable = await addToCartModel.findOne({ productId, userId: currentUser });

    if (isProductAvailable) {
      return res.status(409).json({
        message: 'Product already exists in the cart',
        error: true,
        success: false
      });
    }

    // เพิ่มสินค้าลงในตะกร้า
    const payload = {
      productId: productId,
      quantity: 1,
      userId: currentUser
    };

    const newAddToCart = new addToCartModel(payload);
    const saveProduct = await newAddToCart.save();

    return res.status(201).json({
      data: saveProduct,
      message: 'Product added to cart successfully',
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

module.exports = addToCartControllor;