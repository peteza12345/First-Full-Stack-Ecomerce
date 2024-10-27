const addToCartModel = require("../../models/cartProduct");
const deleteAddToCartProduct = async (req, res) => {
  try {
    // รับ userId จากคำขอ (req.userId) และ รับ deleteProductId จากคำขอ (req.body_id)
    const { userId: currentUserId, body: { _id: deleteProductId } } = req;

    // ลบสินค้าจากตะกร้า จาก user ที่เข้าสู่ระบบ ที่มี _id ตรงกับ deleteProductId และ userId ตรงกับ currentUserId
    const deleteProduct = await addToCartModel.findOneAndDelete({
      _id: deleteProductId,
      userId: currentUserId
    });

    return res.status(200).json({
      data: deleteProduct,
      message: 'Product deleted successfully',
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
module.exports = deleteAddToCartProduct;