import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import loginIcons from "../assest/signin.gif";

// Icons
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Data images
import imageTobase64 from "../helpers/imageTobase64";

// API
import SummaryApi from "../common/index";

// Toastify
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    profilePic: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];

    const imagePic = await imageTobase64(file);

    setData((prev) => {
      return {
        ...prev,
        profilePic: imagePic,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim input fields
    const trimmedData = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      confirmPassword: data.confirmPassword.trim(),
      profilePic: data.profilePic, // Assuming the profile pic doesn't need trimming
    };

    if (trimmedData.password !== trimmedData.confirmPassword) {
      toast.error("Please check password and confirm password");
      return;
    }

    try {
      const response = await fetch(SummaryApi.signUp.url, {
        method: SummaryApi.signUp.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/login");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section id='signup' className='container mx-auto p-4'>
      <div className='bg-white w-full p-5 max-w-sm mx-auto rounded'>
        <div className='size-20 mx-auto relative rounded-full overflow-hidden'>
          {/* Logo icons */}
          <img src={data.profilePic || loginIcons} alt='login icons' />

          <form>
            <label htmlFor='profilePic'>
              <div className='text-xs bg-slate-200 bg-opacity-80 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                Upload Photo
              </div>
              <input
                type='file'
                name='profilePic'
                id='profilePic'
                hidden
                onChange={handleUploadPic}
              />
            </label>
          </form>
        </div>

        {/* Form */}
        <form className='mt-6 flex flex-col gap-y-2' onSubmit={handleSubmit}>
          <section className='grid'>
            <label htmlFor='name'>Name: </label>
            <div className='bg-slate-100 p-2 rounded'>
              <input
                type='text'
                name='name'
                id='name'
                placeholder='Enter name'
                value={data.name}
                onChange={handleOnChange}
                required
                className='size-full outline-none bg-transparent'
              />
            </div>
          </section>

          <section className='grid'>
            <label htmlFor='email'>Email: </label>
            <div className='bg-slate-100 p-2 rounded'>
              <input
                type='email'
                name='email'
                id='email'
                placeholder='Enter email'
                value={data.email}
                onChange={handleOnChange}
                required
                className='size-full outline-none bg-transparent'
              />
            </div>
          </section>

          <section>
            <label htmlFor='password'>Password: </label>
            <div className='bg-slate-100 p-2 rounded flex'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                id='password'
                placeholder='Enter password'
                value={data.password}
                onChange={handleOnChange}
                required
                className='size-full outline-none bg-transparent'
              />
              <div
                className='cursor-pointer text-lg'
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
            </div>
          </section>

          <section>
            <label htmlFor='confirmPassword'>Confirm Password: </label>
            <div className='bg-slate-100 p-2 rounded flex'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name='confirmPassword'
                id='confirmPassword'
                placeholder='Enter confirm password'
                value={data.confirmPassword}
                onChange={handleOnChange}
                required
                className='size-full outline-none bg-transparent'
              />
              <div
                className='cursor-pointer text-lg'
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <span>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
            </div>
          </section>

          <button className='bg-red-600 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:bg-red-700 hover:scale-110 transition-all mt-6 mx-auto block'>
            Sign Up
          </button>
        </form>

        <p className='my-5 '>
          Already have an account ?
          <Link
            to={"/login"}
            className='ms-1 text-red-600 hover:text-red-700 hover:underline'
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
