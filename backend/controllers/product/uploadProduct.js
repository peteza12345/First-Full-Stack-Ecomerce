const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");

async function uploadProductController(req, res) {
  try {
    const sessionUserId = req.userId;

    if (!uploadProductPermission(sessionUserId)) {
      throw new Error('Permission denied');
    }

    const uploadProduct = new productModel(req.body);
    const saveProduct = await uploadProduct.save();

    return res.status(200).json({
      message: 'Product upload successfully.',
      error: false,
      success: true,
      data: saveProduct
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'An error occurred',
      error: true,
      success: false
    });
  }
}

module.exports = uploadProductController;