import { useLocation } from "react-router-dom";
import SummaryApi from "../common";
import { useEffect, useState } from "react";
import VerticalCard from "../components/VerticalCard";

const SearchProduct = () => {
  const { search } = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${SummaryApi.searchProduct.url}${search}`, {
        cache: "no-store",
      });
      const searchData = await response.json();

      setData(searchData.data);
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className='container mx-auto p-4'>
      {loading && <p className='text-center text-lg'>Loading...</p>}

      {/* Search Product */}
      <p className='font-semibold my-3 text-lg'>
        Search Results: {data.length}
      </p>

      {/* Not Found */}
      {!loading && data.length === 0 && (
        <p className='bg-white text-lg text-center p-4'>No Product Found...</p>
      )}

      {/* Product List */}
      {data.length > 0 && <VerticalCard loading={loading} data={data} />}
    </div>
  );
};
export default SearchProduct;
