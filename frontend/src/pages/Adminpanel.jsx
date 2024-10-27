import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Icon
import { FaRegUserCircle } from "react-icons/fa";

// Redux
import { useSelector } from "react-redux";
import ROLE from "../common/role";

const Adminpanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className='min-h-[calc(100vh-120px)] hidden md:flex'>
      <aside className='bg-white min-h-full w-full max-w-60 mx-auto custom-shadow pt-5'>
        <section className='h-32 flex justify-center items-center flex-col'>
          <div className='text-5xl cursor-pointer relative flex justify-center'>
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                alt={user.name}
                className='size-20 rounded-full'
              />
            ) : (
              <FaRegUserCircle />
            )}
          </div>
          <p className='text-lg font-semibold capitalize'>{user?.name}</p>
          <p className='text-sm'>{user?.role}</p>
        </section>

        {/* Navigations */}
        <div>
          <nav className='grid p-4'>
            <Link to={"all-users"} className='px-2 py-1 hover:bg-slate-100'>
              All users
            </Link>

            <Link to={"all-products"} className='px-2 py-1 hover:bg-slate-100'>
              Products
            </Link>

            <Link to={"all-order"} className='px-2 py-1 hover:bg-slate-100'>
              Orders
            </Link>
          </nav>
        </div>
      </aside>

      <main className='w-full h-full p-2 mx-auto'>
        <Outlet />
      </main>
    </div>
  );
};

export default Adminpanel;
