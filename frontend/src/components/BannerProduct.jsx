import image1 from "../assest/banner/img1.webp";
import image2 from "../assest/banner/img2.webp";
import image3 from "../assest/banner/img3.jpg";
import image4 from "../assest/banner/img4.jpg";
import image5 from "../assest/banner/img5.webp";

import image1Mobile from "../assest/banner/img1_mobile.jpg";
import image2Mobile from "../assest/banner/img2_mobile.webp";
import image3Mobile from "../assest/banner/img3_mobile.jpg";
import image4Mobile from "../assest/banner/img4_mobile.jpg";
import image5Mobile from "../assest/banner/img5_mobile.png";
import { useEffect, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const desktopImages = [image1, image2, image3, image4, image5];

  const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile,
  ];

  const nextImage = () => {
    if (desktopImages.length - 1 > currentImage) {
      setCurrentImage((preve) => preve + 1);
    }
  };

  const preveImage = () => {
    if (currentImage !== 0) {
      setCurrentImage((preve) => preve - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (desktopImages.length - 1 > currentImage) {
        nextImage();
      } else {
        setCurrentImage(0);
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage]);

  return (
    <div className='container mx-auto px-4 rounded'>
      <div className='h-56 md:h-72 w-full bg-slate-200 relative'>
        {/* Previous and Next */}
        <div className='absolute z-10 size-full flex items-center'>
          <div className='flex justify-between w-full text-2xl'>
            <button
              className='bg-white shadow-md rounded-full p-1'
              onClick={preveImage}
            >
              <FaAngleLeft />
            </button>

            <button
              className='bg-white shadow-md rounded-full p-1'
              onClick={nextImage}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* Desktop Version */}
        <div className='md:flex flex-nowrap size-full overflow-hidden hidden'>
          {desktopImages.map((imageURl, index) => {
            return (
              <div
                className='size-full min-h-full min-w-full transition-all'
                key={index}
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                <img
                  src={imageURl}
                  alt='banner'
                  className='size-full object-cover'
                />
              </div>
            );
          })}
        </div>

        {/* Tablet Version */}
        <div className='flex flex-nowrap size-full overflow-hidden md:hidden'>
          {mobileImages.map((imageURl, index) => {
            return (
              <div
                className='size-full min-h-full min-w-full transition-all'
                key={index}
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                <img
                  src={imageURl}
                  alt='banner'
                  className='size-full object-cover'
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default BannerProduct;
