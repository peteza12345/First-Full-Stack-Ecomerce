import { useContext, useEffect, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import { Link } from "react-router-dom";
import displayTHBCurrency from "../helpers/displayCurrency";
import addToCart from "../helpers/addTocart";
import Context from "../context";
import scrollTop from "../helpers/scrollTop";

const CategroyWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // เพิ่ม state สำหรับข้อผิดพลาด

  const { fetchUserAddToCart } = useContext(Context); // เรียกใช้ function จาก context
  const loadingList = new Array(13).fill(null); // สร้าง Array ที่มีค่าเป็น null 13 ตัว

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id); // เรียกใช้ function addToCart

    fetchUserAddToCart();
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null); // รีเซ็ตข้อผิดพลาดก่อนดึงข้อมูล
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(categoryProduct?.data);
      // console.log('Horizontal Data:', categoryProduct.data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <div className='container mx-auto px-4 my-6 relative'>
      <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

      {/* แสดง error ถ้ามี */}
      {error && <p className='text-red-500'>{error}</p>}

      {/* Products */}
      <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,320px))] justify-between md:gap-6 overflow-x-scroll scrollbar-none transition-all'>
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow '
              >
                <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'></div>
                <div className='p-4 grid gap-3'>
                  <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'>
                    {_}
                  </h2>
                  <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2'></p>
                  <div className='flex gap-3'>
                    <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                    <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                  </div>
                  <button className='text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse'></button>
                </div>
              </div>
            ))
          : data?.map((product) => {
              return (
                <Link
                  key={product?._id}
                  to={"/product/" + product?._id}
                  state={{ product: product }} // ส่งข้อมูล product ไปยังหน้า ProductPage
                  onClick={scrollTop}
                  className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow'
                >
                  <div className='bg-slate-200 h-48 p-4 min-w-[200px] md:min-w-[145px] flex justify-center items-center'>
                    <img
                      src={product.productImage[0]}
                      className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply'
                      alt={product.productName}
                    />
                  </div>
                  <div className='p-4 grid gap-3'>
                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>
                      {product?.productName}
                    </h2>
                    <p className='capitalize text-slate-500'>
                      {product?.category}
                    </p>
                    <div className='flex gap-3'>
                      <p className='text-red-600 font-medium'>
                        {displayTHBCurrency(product?.sellingPrice)}
                      </p>
                      <p className='text-slate-500 line-through'>
                        {displayTHBCurrency(product?.price)}
                      </p>
                    </div>
                    <button
                      className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full'
                      onClick={(e) => handleAddToCart(e, product?._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default CategroyWiseProductDisplay;
