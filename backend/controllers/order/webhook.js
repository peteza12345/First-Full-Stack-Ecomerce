const stripe = require('../../config/stripe');
const orderModel = require('../../models/orderProductModel');
const addToCartModel = require('../../models/cartProduct');

const endpointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;

async function getLineItems(lineItems) {
  let ProductItems = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      const productData = {
        productId: productId,
        name: product.name,
        price: item.price.unit_amount / 100,
        quantity: item.quantity,
        image: product.images,
      };

      ProductItems.push(productData);
    }
  }

  return ProductItems;
};

const webhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  const payloadString = JSON.stringify(request.body)

  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: endpointSecret,
  });

  let event;
  try {
    event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    // case 'payment_intent.succeeded':
    //   const paymentIntent = event.data.object;
    //   // Then define and call a method to handle the successful payment intent.
    //   // handlePaymentIntentSucceeded(paymentIntent);
    //   break;

    case 'checkout.session.completed':
      const session = event.data.object;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );

      const productDetials = await getLineItems(lineItems);
      const orderDetails = {
        productDetails: productDetials,
        email: session.customer_email,
        userId: session.metadata.userId,
        paymentDetails: {
          paymentId: session.payment_intent,
          payment_method_type: session.payment_method_types,
          payment_status: session.payment_status,
        },
        shipping_options: session.shipping_options.map((s) => {
          return {
            ...s,
            shipping_amount: s.shipping_amount / 100
          }
        }),
        totalAmount: session.amount_total / 100
      };

      const order = new orderModel(orderDetails);
      const saveOrder = await order.save();

      // Delete cart products
      if (saveOrder?._id) {
        await addToCartModel.deleteMany({
          userId: session.metadata.userId
        });
      }

      break;
    // case 'payment_method.attached':
    //   const paymentMethod = event.data.object;
    //   // Then define and call a method to handle the successful attachment of a PaymentMethod.
    //   // handlePaymentMethodAttached(paymentMethod);
    //   break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  //response.status(200).send();
  response.status(200).json({ received: true });
};

module.exports = webhooks;