const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");

async function updateProductControllor(req, res) {
  try {
    if (!uploadProductPermission(req.userId)) {
      throw new Error('Promission denied');
    }

    const { _id, ...resBody } = req.body;
    const updateProduct = await productModel.findByIdAndUpdate(_id, resBody);

    return res.status(200).json({
      message: 'Product update successfully',
      data: updateProduct,
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
}

module.exports = updateProductControllor;