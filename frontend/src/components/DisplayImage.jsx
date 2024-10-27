import { CgClose } from "react-icons/cg";

const DisplayImage = ({ imgUrl, onClose }) => {
  return (
    <div className='fixed inset-0 flex justify-center items-center'>
      <div className='bg-white shadow-lg rounded max-w-5xl mx-auto p-4'>
        <div
          className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer'
          onClick={onClose}
        >
          <CgClose />
        </div>
        <div className='flex justify-center p-4 max-w-[80vh] max-h-[80vh]'>
          <img src={imgUrl} alt='product' className='size-full object-cover' />
        </div>
      </div>
    </div>
  );
};
export default DisplayImage;
