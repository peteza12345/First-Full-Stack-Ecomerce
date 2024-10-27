import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import loginIcons from "../assest/signin.gif";

// API
import SommaryApi from "../common/index";
import Context from "../context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { fetchUserDetail, fetchUserAddToCart } = useContext(Context); // รับ function จาก context

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim input fields
    const trimmedData = {
      email: data.email.trim(),
      password: data.password.trim(),
    };

    try {
      const response = await fetch(SommaryApi.signIn.url, {
        method: SommaryApi.signIn.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/");
        // call function fetchUserDetail
        fetchUserDetail();
        // call function fetchUserAddToCart
        fetchUserAddToCart();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section id='login' className='container mx-auto p-4'>
      <div className='bg-white w-full p-5 max-w-sm mx-auto rounded'>
        <div className='size-20 mx-auto'>
          {/* Logo icons */}
          <img src={loginIcons} alt='login icons' />
        </div>

        {/* Form */}
        <form className='mt-6 flex flex-col gap-y-2' onSubmit={handleSubmit}>
          <div className='grid'>
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
          </div>

          <div>
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

            <Link
              to={"/forgot-password"}
              className='block w-fit ml-auto mt-2 hover:underline hover:text-red-600'
            >
              Forgot Password ?
            </Link>
          </div>

          <button className='bg-red-600 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:bg-red-700 hover:scale-110 transition-all mt-6 mx-auto block'>
            Login
          </button>
        </form>

        <p className='my-5 '>
          Don't have an account ?
          <Link
            to={"/sign-up"}
            className='ms-1 text-red-600 hover:text-red-700 hover:underline'
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
