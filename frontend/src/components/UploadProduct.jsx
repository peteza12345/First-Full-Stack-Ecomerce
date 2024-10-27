import { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/ProductCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const uploadImageCloudinary = await uploadImage(file);
    setData((preve) => {
      return {
        ...preve,
        productImage: [...preve.productImage, uploadImageCloudinary.url],
      };
    });
  };

  const handleDeleteProductImage = async (index) => {
    // console.log("image index:", index);

    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((prev) => {
      return {
        ...prev,
        productImage: [...newProductImage],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData.message);
      fetchData();
      onClose();
    } else {
      toast.error(responseData.message);
    }
  };

  return (
    <div className='fixed size-full bg-slate-200 bg-opacity-35 inset-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded size-full max-w-2xl max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>UploadProduct</h2>
          <div
            className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer'
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form
          className='grid p-4 gap-2 overflow-y-scroll h-full pb-5'
          onSubmit={handleSubmit}
        >
          <label htmlFor='productName'>Product Name :</label>
          <input
            type='text'
            name='productName'
            id='productName'
            required
            value={data.productName}
            placeholder='Enter Product name'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          />

          <label htmlFor='brandName' className='mt-3'>
            Brand Name :
          </label>
          <input
            type='text'
            name='brandName'
            id='brandName'
            required
            value={data.brandName}
            placeholder='Enter brand name'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          />

          <label htmlFor='brandName' className='mt-3'>
            Category :
          </label>
          <select
            name='category'
            id='category'
            required
            value={data.category}
            className='p-2 bg-slate-100 border rounded'
            onChange={handleOnChange}
          >
            <option value={""}>Select Category</option>
            {productCategory.map((el, index) => {
              return (
                <option value={el.value} key={el.id + index}>
                  {el.label}
                </option>
              );
            })}
          </select>

          <label htmlFor='productImage' className='mt-3'>
            Product Image :
          </label>
          <label htmlFor='uploadImageInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
              <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'>
                  <FaCloudUploadAlt />
                </span>
                <p className='text-sm'>Upload Product Image.</p>
                <input
                  type='file'
                  name='uploadImageInput'
                  id='uploadImageInput'
                  className='hidden'
                  onChange={handleUploadProduct}
                />
              </div>
            </div>
          </label>
          <div>
            {data.productImage.length > 0 ? (
              <div className='flex items-center gap-2'>
                {data.productImage.map((el, index) => (
                  <div className='relative group' key={index}>
                    <img
                      src={el}
                      alt='Uploaded product'
                      width={100}
                      height={100}
                      className='bg-slate-100 border cursor-pointer'
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />

                    <div
                      className='absolute bottom-0 right-0 p-1 text-white cursor-pointer bg-red-600 rounded-full hidden group-hover:block'
                      onClick={() => handleDeleteProductImage(index)}
                    >
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-red-600 text-xs'>
                *Please upload product image
              </p>
            )}
          </div>

          <label htmlFor='price' className='mt-3'>
            Price :
          </label>
          <input
            type='number'
            name='price'
            id='price'
            required
            value={data.price}
            placeholder='Enter price'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          />

          <label htmlFor='sellingPrice' className='mt-3'>
            Selling Price :
          </label>
          <input
            type='number'
            name='sellingPrice'
            id='sellingPrice'
            required
            value={data.sellingPrice}
            placeholder='Enter sellingPrice'
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          />

          <label htmlFor='description' className='mt-3'>
            Description :
          </label>
          <textarea
            name='description'
            id='description'
            rows={3}
            placeholder='Enter product description.'
            value={data.description}
            onChange={handleOnChange}
            className='h-28 bg-slate-100 border resize-none p-1'
          ></textarea>

          <button
            type='submit'
            className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'
          >
            Upload Product
          </button>
        </form>
      </div>

      {/* Display image full screen */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};
export default UploadProduct;
