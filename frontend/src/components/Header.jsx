import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";

// Icons
import { GrSearch } from "react-icons/gr";
import { FaRegUserCircle, FaShoppingCart } from "react-icons/fa";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../store/userSlice.js";

// API
import SummaryApi from "../common/index.js";

// Toastify
import { toast } from "react-toastify";
import ROLE from "../common/role.jsx";
import Context from "../context/index.js";

const Header = () => {
  const [menuDisplay, setMenuDisplay] = useState(false); // สร้างตัวแปรเพื่อแสดงเมนู
  const navigate = useNavigate(); // สร้างตัวแปรเพื่อเปลี่ยนหน้า
  const user = useSelector((state) => state?.user?.user); // ดึงค่าจาก Redux
  const dispatch = useDispatch(); // ดึงค่าจาก Redux
  const context = useContext(Context); // ดึงค่าจาก Context มาใช้ cartProductCount
  const { search } = useLocation();
  const query = new URLSearchParams(search).getAll("q");
  const [searchValue, setSearchValue] = useState(query || "");

  // ซ่อนเมนูเมื่อคลิกนอกเมนู
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".user-menu")) {
        // ตรวจสอบว่ามีการคลิกที่เมนูหรือไม่
        setMenuDisplay(false); // ซ่อนเมนู
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick); // ยกเลิกใช้งานซ้ํา
    };
  }, []);

  const handleLogout = async () => {
    if (!user?._id) {
      return; // ถ้าไม่มี user ให้หยุดทำงานทันที
    }

    try {
      const response = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: "include", // ให้รับค่าจาก cookie
        cache: "no-store", // ไม่เก็บข้อมูล ใน cache
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null)); // ลบข้อมูล user จาก Redux
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Logout error:", err);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target; // ดึงค่าจาก input

    setSearchValue(value);
    // ถ้ามีค่าให้กลับไปหน้า search
    if (value.trim()) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search"); // ถ้าไม่มีค่าให้กลับไปหน้า search
    }
  };

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <nav className='h-full container mx-auto flex items-center justify-between px-4'>
        <Link to='/'>
          <Logo width={90} height={50} />
        </Link>

        {/* Search */}
        <div className='w-full hidden lg:flex justify-center items-center max-w-sm border rounded-full focus-within:shadow pl-3'>
          <input
            type='text'
            placeholder='Search product here...'
            className='w-full outline-none'
            value={searchValue}
            onChange={handleSearch}
          />

          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white cursor-pointer'>
            <GrSearch />
          </div>
        </div>

        {/* Users icons and cart */}
        <div className='flex items-center gap-x-7'>
          {/* User */}
          <div className='relative flex justify-center user-menu'>
            {user?._id && (
              <div
                className='text-3xl cursor-pointer relative flex justify-center'
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    alt={user.name}
                    className='size-10 rounded-full'
                  />
                ) : (
                  <FaRegUserCircle />
                )}
              </div>
            )}

            {/* menu */}
            {menuDisplay && (
              <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded hidden md:block border border-slate-200'>
                <nav className='flex flex-col gap-y-2'>
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to='/admin-panel/all-products'
                      className='whitespace-nowrap hover:bg-slate-100 p-2 rounded-md'
                      onClick={() => setMenuDisplay((prev) => !prev)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <Link
                    to='/order'
                    className='whitespace-nowrap hover:bg-slate-100 p-2 rounded-md'
                    onClick={() => setMenuDisplay((prev) => !prev)}
                  >
                    Order
                  </Link>
                </nav>
              </div>
            )}
          </div>

          {/* cart */}
          {user?._id && (
            <Link to='/cart' className='text-2xl relative'>
              <span>
                <FaShoppingCart />
              </span>

              <div className='bg-red-600 text-white size-5 rounded-full p-1 flex justify-center items-center absolute -top-2 -right-3'>
                <p className='text-sm'>{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          {/* Login/Logout */}
          <div>
            {user?._id ? (
              <button
                className='px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700'
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link
                to='/login'
                className='px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700'
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
