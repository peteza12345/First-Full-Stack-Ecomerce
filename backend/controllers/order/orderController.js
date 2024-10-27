const orderModel = require('../../models/orderProductModel');

const orderController = async (request, response) => {
  try {
    const currentUserId = request.userId;

    if (!currentUserId) {
      return response.status(401).json({
        message: 'Unauthorized',
        error: true,
        success: false
      });
    }

    const orderList = await orderModel.find({
      userId: currentUserId
    }).sort({ createdAt: -1 });

    response.status(200).json({
      data: orderList,
      message: 'Order fetched successfully',
      success: true,
      error: false
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: error.message || 'An error occurred',
      error: true,
      success: false
    });
  }
};

module.exports = orderController;