import { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import { Link } from "react-router-dom";
import displayTHBCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import addToCart from "../helpers/addTocart";
import Context from "../context";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // เพิ่ม state สำหรับข้อผิดพลาด
  const [scrollPosition, setScrollPosition] = useState(0); // เก็บค่าตำแหน่งการ scroll
  const scrollElement = useRef(); // กําหนดตัวแปรเพื่อเก็บตัวแปร scroll

  const loadingList = new Array(13).fill(null); // สร้าง Array ที่มีค่าเป็น null 13 ตัว

  const { fetchUserAddToCart } = useContext(Context); // เรียกใช้ function จาก context
  const handleAddtoCart = async (e, id) => {
    await addToCart(e, id);

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
  }, [category]); // เพิ่ม dependency ของ category

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
    setScrollPosition(scrollElement.current.scrollLeft);
  };

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
    setScrollPosition(scrollElement.current.scrollLeft);
  };

  return (
    <div className='container mx-auto px-4 my-6 relative'>
      <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

      {/* แสดง error ถ้ามี */}
      {error && <p className='text-red-500'>{error}</p>}

      {/* Products */}
      <div
        className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all'
        ref={scrollElement}
      >
        {/* ปุ่มเลื่อนซ้าย */}
        {scrollPosition > 0 && (
          <button
            className='bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block'
            onClick={scrollLeft}
          >
            <FaAngleLeft />
          </button>
        )}

        {/* ปุ่มเลื่อนขวา */}
        <button
          className='bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block'
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>

        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'
              >
                <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse'></div>
                <div className='p-4 grid w-full gap-2'>
                  <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full'>
                    {_}
                  </h2>
                  <p className='capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full'></p>
                  <div className='flex gap-3 w-full'>
                    <p className='text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                    <p className='text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                  </div>
                  <button className='text-sm  text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse'></button>
                </div>
              </div>
            ))
          : data?.map((product) => {
              return (
                <Link
                  key={product?._id}
                  to={"product/" + product?._id}
                  className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'
                >
                  <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                    <img
                      src={product?.productImage[0]}
                      className='object-scale-down h-full hover:scale-110 transition-all'
                      alt={product?.productName}
                    />
                  </div>
                  <div className='p-4 grid'>
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
                      onClick={(e) => handleAddtoCart(e, product?._id)}
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
export default HorizontalCardProduct;
