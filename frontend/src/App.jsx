import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./styles/App.css";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./store/userSlice.js";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Context from "./context/index.js";

// API
import SummaryApi from "./common";

function App() {
  const [cartProductCount, setCartProductCount] = useState(0);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.details);

  // ใช้ useCallback เพื่อป้องกันไม่ให้ฟังก์ชันถูกสร้างใหม่ทุกครั้งที่ render
  const fetchUserDetail = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
      });

      const dataApi = await response.json();

      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data || null));
      } else {
        dispatch(setUserDetails(null));
        // console.error('Failed to set user details:', dataApi.message);
      }
      // console.log('data user', response)
    } catch (error) {
      console.error("An error occurred while fetching user details:", error);
    }
  }, [dispatch]);

  const fetchUserAddToCart = useCallback(async () => {
    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: "include",
      });

      const dataApi = await dataResponse.json();

      setCartProductCount(dataApi?.data?.count);
    } catch (error) {
      console.error("An error occurred while fetching user details:", error);
    }
  }, []);

  useEffect(() => {
    // เช็คก่อนว่ามีข้อมูลผู้ใช้หรือไม่ ถ้าไม่มีค่อย fetch
    if (!userDetails) {
      fetchUserDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails, fetchUserDetail]);

  useEffect(() => {
    // User Detail Cart Product
    fetchUserAddToCart();
  }, [fetchUserAddToCart]);

  return (
    <>
      <Context.Provider
        value={{
          fetchUserDetail, // user Detail
          cartProductCount, // current user add to cart product count
          fetchUserAddToCart,
        }}
      >
        <ToastContainer position='top-center' />
        <Header />
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
