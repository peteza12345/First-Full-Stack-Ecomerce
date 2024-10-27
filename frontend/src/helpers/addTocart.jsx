import SummaryApi from "../common";
import { toast } from "react-toastify";

const addToCart = async (e, id) => {
  e?.stopPropagation(); // ห้ามคลิก
  e?.preventDefault();

  try {
    const response = await fetch(SummaryApi.addToCartProduct.url, {
      method: SummaryApi.addToCartProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(
        responseData.message || "Product added to cart successfully."
      );
    } else {
      toast.error(
        responseData.message || "An error occurred while adding the product."
      );
    }

    return responseData;
  } catch (error) {
    toast.error(error.message || "Something went wrong. Please try again.");
    return { success: false, error: error.message };
  }
};

export default addToCart;
