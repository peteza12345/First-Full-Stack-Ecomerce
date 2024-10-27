import { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import displayTHBCurrency from "../helpers/displayCurrency";

const OrderPage = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await fetch(SummaryApi.getOrder.url, {
      method: SummaryApi.getOrder.method,
      credentials: "include",
    });

    const responseData = await response.json();
    // ตรวจสอบว่าข้อมูลที่ได้เป็น array หรือไม่
    setData(responseData.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className='container mx-auto p-6 space-y-8'>
      {data.length === 0 && (
        <p className='text-center text-3xl font-semibold text-red-500'>
          No Orders Available
        </p>
      )}

      <article className='w-full'>
        {data.map((item, index) => (
          <div
            key={item.userId + index}
            className='mb-8 border rounded-lg shadow-md p-5 bg-white'
          >
            <p className='font-semibold text-xl text-gray-700 mb-4'>
              Order Date: {moment(item.createdAt).format("LL")}
            </p>

            <div className='flex flex-col lg:flex-row justify-between'>
              {/* Product Details */}
              <div className='grid gap-4 lg:flex-1'>
                {item?.productDetails.map((product, idx) => (
                  <div
                    key={product.productId + idx}
                    className='flex gap-4 items-center p-4 bg-gray-50 rounded-lg shadow-sm'
                  >
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className='w-24 h-24 bg-gray-200 object-contain rounded-md'
                    />
                    <div className='flex-1'>
                      <h3 className='font-medium text-lg text-gray-800 truncate'>
                        {product.name}
                      </h3>
                      <div className='flex items-center justify-between mt-2 text-gray-600'>
                        <span className='text-lg font-semibold text-red-500'>
                          {displayTHBCurrency(product.price)}
                        </span>
                        <p className='text-sm'>Quantity: {product.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment and Shipping Details */}
              <div className='flex flex-col gap-4 p-4 lg:w-1/3 border-t lg:border-l lg:border-t-0 border-gray-300 mt-6 lg:mt-0 lg:pl-6'>
                <div className='space-y-1'>
                  <h4 className='font-semibold text-lg text-gray-700'>
                    Payment Details:
                  </h4>
                  <p>Method: {item.paymentDetails.payment_method_type[0]}</p>
                  <p>Status: {item.paymentDetails.payment_status}</p>
                </div>

                <div className='space-y-1'>
                  <h4 className='font-semibold text-lg text-gray-700'>
                    Shipping Details:
                  </h4>
                  {item.shipping_options.map((shipping, idx) => (
                    <p
                      key={shipping.shipping_rate + idx}
                      className='text-gray-600'
                    >
                      Shipping Amount:{" "}
                      {displayTHBCurrency(shipping.shipping_amount)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className='flex justify-end mt-4'>
              <p className='font-semibold text-xl text-gray-800'>
                Total Amount: {displayTHBCurrency(item.totalAmount)}
              </p>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
};

export default OrderPage;
