const stripe = require("../../config/stripe");
const userModel = require("../../models/userModel");

const paymentController = async (request, response) => {
  try {
    const { cartItems } = request.body;
    const user = await userModel.findById({ _id: request.userId });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        {
          shipping_rate: "shr_1QBYRN023foFkCYp73ramSOD",
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: request.userId,
      },
      line_items: cartItems.map((item) => {
        return {
          price_data: {
            currency: "thb",
            product_data: {
              name: item.productId.brandName,
              images: item.productId.productImage,
              metadata: {
                productId: item.productId._id,
              }
            },
            unit_amount: item.productId.sellingPrice * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/canceled`,
    };

    const session = await stripe.checkout.sessions.create(params);

    response.status(303).json(session);
  } catch (error) {
    response.status(500).json({
      message: error?.message || 'An error occurred',
      error: true,
      success: false
    });
  }
};

module.exports = paymentController;