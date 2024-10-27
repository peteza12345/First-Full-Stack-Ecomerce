const userModel = require("../../models/userModel");
const orderModel = require("../../models/orderProductModel");

const allOrderController = async (request, response) => {
  try {
    const user = await userModel.findById(request.userId);

    if (!user || user.role !== "ADMIN") {
      return response.status(401).json({
        message: "Unauthorized",
        error: true,
        success: false
      });
    }

    const Allorder = await orderModel.find().sort({ createdAt: -1 }); // sort by createdAt in descending order

    response.status(200).json({
      data: Allorder,
      message: "Order fetched successfully",
      success: true,
      error: false
    });

  } catch (error) {
    console.error(error);

    response.status(500).json({
      message: error.message || "An error occurred",
      error: true,
      success: false
    });
  }
};

module.exports = allOrderController;