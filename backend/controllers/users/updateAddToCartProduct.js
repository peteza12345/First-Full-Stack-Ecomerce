const addToCartModel = require("../../models/cartProduct");


const updateAddToCartProduct = async (req, res) => {
  try {
    // รับ userId และ productId (_id) จากคำขอ (req) และจำนวนใหม่ (quantity) จากร่างกายคำขอ
    const { userId: currentUserId, body: { _id: addTocartProductId, quantity: qty } } = req;

    const product = await addToCartModel.findOneAndUpdate(
      { _id: addTocartProductId, userId: currentUserId },
      { $set: { quantity: qty } },
      { new: true }
    );

    return res.status(200).json({
      data: product,
      message: 'Product updated successfully',
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
module.exports = updateAddToCartProduct;