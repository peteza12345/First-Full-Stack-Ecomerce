import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaStar, FaStarHalf } from "react-icons/fa";
import displayTHBCurrency from "../helpers/displayCurrency";
import CategroyWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import Context from "../context";
import addToCart from "../helpers/addTocart";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);
  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const { id } = useParams(); // รับ ID ของผลิตภัณฑ์จาก URL

  const productImageListLoading = new Array(4).fill(null); // สร้าง array เปล่า 4 อัน

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const dataResponse = await response.json();
      setData(dataResponse?.data);
      setActiveImage(dataResponse?.data?.productImage[0]);
    } catch (error) {
      console.error("Error:", error);
      // อาจใช้ state ในการแสดงข้อความแสดงข้อผิดพลาด
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleMouseEnterProduct = useCallback((imageURL) => {
    setActiveImage(imageURL);
  }, []);

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);

    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);

    fetchUserAddToCart(); // Refresh cart after updating
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);

    fetchUserAddToCart(); // Refresh cart after updating
    navigate("/cart");
  };

  return (
    <section className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
        {/* Product Image */}
        <section className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
          {/* Big Image */}
          <div className='size-[300px] bg-slate-200 relative p-2'>
            <img
              src={activeImage}
              alt={data?.productName}
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
              className='size-full object-scale-down mix-blend-multiply'
            />

            {/* Product zoom */}
            {zoomImage && (
              <div className='hidden lg:block absolute min-w-[500px] min-h-[400px] overflow-hidden bg-slate-200 p-1 -right-[510px] top-0'>
                <div
                  className='size-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                      zoomImageCoordinate.y * 100
                    }%`,
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* Small Image */}
          <div className='h-full'>
            {loading ? (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {productImageListLoading.map((_, index) => (
                  <div
                    key={index}
                    className='size-20 bg-slate-200 rounded p-1 animate-pulse'
                  ></div>
                ))}
              </div>
            ) : (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {data?.productImage?.map((imgURL, index) => (
                  <div
                    key={"loadingImage" + index}
                    className='size-20 bg-slate-200 rounded p-1'
                  >
                    <img
                      src={imgURL}
                      alt='product img'
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                      onClick={() => handleMouseEnterProduct(imgURL)}
                      className='size-full object-scale-down mix-blend-multiply cursor-pointer'
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Product Details */}
        {loading ? (
          <section className='grid gap-1 w-full'>
            <p className='bg-slate-200 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block'></p>
            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
            <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-200 animate-pulse w-full'></h2>
            <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-full'></p>

            <div className='text-red-600 bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full'></div>

            <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full'>
              <p className='text-red-600 bg-slate-200 w-full'></p>
              <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
            </div>

            <div className='flex items-center gap-3 my-2 w-full'>
              <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
              <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
            </div>

            <div className='w-full'>
              <p className='text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-full'></p>
              <p className=' bg-slate-200 rounded animate-pulse h-10 lg:h-12  w-full'></p>
            </div>
          </section>
        ) : (
          <section className='flex flex-col gap-1'>
            <p className='bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit'>
              {data?.brandName}
            </p>
            <h2 className='text-2xl lg:text-4xl font-medium'>
              {data?.productName}
            </h2>
            <p className='capitalize text-slate-400'>{data?.category}</p>

            {/* Icons */}
            <div className='text-red-600 flex items-center gap-1'>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
            </div>

            {/* Price */}
            <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
              <p className='text-red-600'>
                {displayTHBCurrency(data?.sellingPrice)}
              </p>
              <p className='text-slate-400 line-through'>
                {displayTHBCurrency(data?.price)}
              </p>
            </div>

            {/* Buy Button */}
            <div className='flex items-center gap-3 my-2'>
              <button
                className='border-red-600 border-2 rounded px-3 py-1 min-w-[100px] text-red-600 font-medium hover:bg-red-600 hover:text-white'
                onClick={(e) => handleBuyProduct(e, data?._id)}
              >
                Buy
              </button>
              <button
                className='border-red-600 border-2 rounded px-3 py-1 min-w-[100px] font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white'
                onClick={(e) => handleAddToCart(e, data?._id)}
              >
                Add To Cart
              </button>
            </div>

            {/* Descriptions */}
            <div>
              <p className='text-slate-600 font-medium my-1'>Description: </p>
              <p>{data?.description}</p>
            </div>
          </section>
        )}
      </div>

      {/* Categorys */}
      {data.category && (
        <CategroyWiseProductDisplay
          category={data?.category}
          heading={"Recommended Product"}
        />
      )}
    </section>
  );
};
export default ProductDetails;
