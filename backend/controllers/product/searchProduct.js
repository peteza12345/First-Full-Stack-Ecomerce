const productModel = require('../../models/productModel');

const searchProduct = async (req, res) => {
  try {
    const query = req.query.q; // Get the search query from the request
    const regex = new RegExp(query, 'i', 'g'); // สร้างรายการเกี่ยวกับคําที่ต้องการค้นหา ในรูปแบบ RegExp ที่ใช้ในการค้นหา

    const product = await productModel.find({
      $or: [
        { productName: regex },
        { category: regex }
      ]
    }); // ค้นหาสินค้าที่มีชื่อหรือหมวดหมู่ตรงกับคําที่ค้นหา

    return res.status(200).json({
      data: product,
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
}
module.exports = searchProduct;