import { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayTHBCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const context = useContext(Context);
  const loadingCart = new Array(context.cartProductCount).fill(null); // สร้าง Array ที่มีค่าเป็น null จาก context.cartProductCount

  const fetchData = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include", // ให้รับค่าจาก cookie
      });

      const responseData = await response.json();

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      console.log(error + "Something went wrong. Please try again.");
    }
  };

  const handleLoading = async () => {
    await fetchData();
  };

  useEffect(() => {
    setLoading(true);
    handleLoading();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCartQuantity = async (productId, newQuantity) => {
    if (newQuantity > 0) {
      // ตรวจสอบว่า newQuantity มากกว่า 0
      try {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
          method: SummaryApi.updateCartProduct.method,
          credentials: "include", // ให้รับค่าจาก cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: productId,
            quantity: newQuantity,
          }), // ส่งค่า productId: _id และ newQuantity: quantity ในรูปแบบ JSON
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
          fetchData(); // Refresh cart after updating
        } else {
          console.error(
            "Failed to update cart quantity:",
            responseData.message
          );
        }
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    } else if (newQuantity === 0) {
      // ตรวจสอบว่า newQuantity เป็น 0
      deleteCartProduct(productId);
    }
  };

  const deleteCartProduct = async (productId) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: productId,
      }), // ส่งค่า productId: _id ในรูปแบบ JSON
    });

    const responseData = await response.json();

    if (responseData.success) {
      // ถ้าอัพเดทเรียบร้อย ให้ดึงข้อมูลใหม่
      fetchData();
      context.fetchUserAddToCart(); // Refresh cart after updating
    }
  };

  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  ); // นับจำนวนสินค้าทั้งหมด
  const totalPrice = data.reduce(
    (prevValue, currentValue) =>
      prevValue + currentValue.quantity * currentValue?.productId?.sellingPrice,
    0
  ); // คำนวนราคาทั้งหมด ตามจำนวนสินค้า

  const handlePayment = async () => {
    const stripePromis = await loadStripe(
      process.env.REACT_APP_STRIPE_PUBLIC_KEY
    );

    const response = await fetch(SummaryApi.payment.url, {
      method: SummaryApi.payment.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItems: data,
      }),
    });

    const responseData = await response.json();

    if (responseData?.id) {
      await stripePromis.redirectToCheckout({
        sessionId: responseData?.id,
      });
    }
    console.log("payment: ", responseData);
  };

  return (
    <div className='container mx-auto'>
      <div className='text-center text-lg my-3'>
        {/* data === 0 & !loading => No items in cart */}
        {data?.length === 0 && !loading && (
          <p className='bg-white py-5'>No items in cart</p>
        )}
      </div>

      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
        {/* View Product Start รายการสินค้า */}
        <div className='w-full max-w-3xl'>
          {/* Loading is true */}
          {loading
            ? loadingCart?.map((_, index) => (
                <div
                  key={"Add To Cart Loading" + index}
                  className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'
                ></div>
              ))
            : // Loading is false
              data?.map((product, index) => (
                <div
                  key={product?._id + "Add To Cart Loading" || index}
                  className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'
                >
                  <div className='size-32 bg-slate-200'>
                    <img
                      src={product?.productId?.productImage[0]}
                      alt={product?.productId?.productName}
                      className='size-full object-scale-down mix-blend-multiply'
                    />
                  </div>

                  {/* Product Details รายละเอียด */}
                  <div className='px-4 py-2 relative'>
                    {/* Delete Product ลบข้อมูล สินค้า */}
                    <button
                      type='button'
                      className='absolute right-3 top-3 text-red-600 rounded-full hover:bg-red-600 hover:text-white p-1'
                      onClick={() => deleteCartProduct(product?._id)}
                    >
                      <MdDelete size={18} />
                    </button>

                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>
                      {product?.productId?.productName}
                    </h2>

                    {/* Category ประเภท */}
                    <p className='capitalize text-slate-500'>
                      {product?.productId?.category}
                    </p>

                    {/* Price ราคา ต่อหน่วย || จํานวน */}
                    <div className='flex justify-between items-center'>
                      <p className='text-red-600 font-medium text-lg'>
                        Price:{" "}
                        {displayTHBCurrency(product?.productId?.sellingPrice)}
                      </p>
                      <p className='text-slate-600 font-semibold text-lg'>
                        Qty:{" "}
                        {displayTHBCurrency(
                          product?.productId?.sellingPrice * product?.quantity
                        )}
                      </p>
                    </div>

                    {/* Quantity จํานวน || Button*/}
                    <div className='flex items-center gap-3 mt-1'>
                      <button
                        type='button'
                        className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white size-6 flex justify-center items-center rounded'
                        onClick={() =>
                          updateCartQuantity(
                            product?._id,
                            product?.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span>{product?.quantity}</span>
                      <button
                        type='button'
                        className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white size-6 flex justify-center items-center rounded'
                        onClick={() =>
                          updateCartQuantity(
                            product?._id,
                            product?.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {/* View Product End */}

        {/* Summary Start */}
        {data[0] && (
          <div className='mt-5 lg:mt-0 w-full max-w-sm'>
            {loading ? (
              <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'></div>
            ) : (
              <div className='h-36 bg-white text-center'>
                <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>

                {/* Quantity */}
                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                  <p>Quantity:</p>
                  <p>{totalQty}</p>
                </div>

                {/* Total */}
                <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                  <p>Total:</p>
                  <p>{displayTHBCurrency(totalPrice)}</p>
                </div>

                {/* Button */}
                <button
                  type='button'
                  className='bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 mt-2 w-full'
                  onClick={handlePayment}
                >
                  Payment
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary End */}
      </div>
    </div>
  );
};
export default Cart;
