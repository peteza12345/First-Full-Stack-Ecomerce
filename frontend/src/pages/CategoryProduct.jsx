import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/ProductCategory";
import { useEffect, useState } from "react";
import VerticalCard from "../components/VerticalCard";
import SummaryApi from "../common";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const urlSearch = new URLSearchParams(location.search); // สร้างตัวแปรเพื่อดึงค่าจาก URLSearchParams
  const urlCategoryListinArray = urlSearch.getAll("category"); // ดึงค่าจาก URLSearchParams แล้วเก็บไว้ในตัวแปร urlCategoryListinArray
  const urlCategoryListObject = urlCategoryListinArray.reduce((acc, el) => {
    acc[el] = true;
    return acc;
  }, {}); // แปลงค่าใน urlCategoryListinArray ให้เป็น Object และเก็บไว้ในตัวแปร urlCategoryListObject
  const initialCategoryState = productCategory.reduce((acc, category) => {
    acc[category.value] = urlCategoryListObject[category.value] || false;
    return acc;
  }, {});

  const [selectCategory, setSelectCategory] = useState(initialCategoryState);
  const [sortBy, setSortBy] = useState("");

  const fetchData = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          category: category,
        }),
      });
      const responseData = await response.json();

      setData(responseData?.data || []);
    } catch (error) {
      console.error("Something went wrong. Please try again." || error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = ({ target: { name, value, checked } }) => {
    setSelectCategory((prevState) => ({
      ...prevState,
      [value]: checked,
    })); // เปลี่ยนค่าที่เลือก
  }; // สร้างฟังก์ชัน handleCategoryChange สําหรับการเลือกหมวดหมู่

  useEffect(() => {
    const selectedCategories = Object.keys(selectCategory).filter(
      (key) => selectCategory[key]
    );
    const params = new URLSearchParams();
    selectedCategories.forEach((cat) => params.append("category", cat));

    navigate(`/product-category?${params.toString()}`);
    fetchData(selectedCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectCategory, navigate]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);

    setData((prev) =>
      [...prev].sort((a, b) =>
        value === "asc"
          ? a.sellingPrice - b.sellingPrice
          : b.sellingPrice - a.sellingPrice
      )
    );
  };

  return (
    <div className='container mx-auto p-4'>
      {/* Desktop version */}
      <div className='hidden lg:grid grid-cols-[200px_1fr]'>
        {/* Left side start */}
        <div className='bg-white p-2 min-h-[calc(100vh-120px)]'>
          {/* Sort by */}
          <div>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>
              Sort by
            </h3>

            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3'>
                <input
                  type='radio'
                  name='sortByLow'
                  id='sortByLow'
                  checked={sortBy === "asc"}
                  value={"asc"}
                  onChange={handleOnChangeSortBy}
                />
                <label htmlFor='sortByLow'>Price - Low to High</label>
              </div>

              <div className='flex items-center gap-3'>
                <input
                  type='radio'
                  name='soryByHight'
                  id='soryByHight'
                  checked={sortBy === "dsc"}
                  value={"dsc"}
                  onChange={handleOnChangeSortBy}
                />
                <label htmlFor='soryByHight'>Price - High to Low</label>
              </div>
            </form>
          </div>

          {/* Filter by */}
          <div>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>
              Category
            </h3>

            <form className='text-sm flex flex-col gap-2 py-2'>
              {productCategory.map((categoryName) => (
                <div className='flex items-center gap-3' key={categoryName.id}>
                  <input
                    type='checkbox'
                    name={categoryName.value}
                    checked={selectCategory[categoryName.value]}
                    value={categoryName.value}
                    id={categoryName.value}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor={categoryName.value}>
                    {categoryName.label}
                  </label>
                </div>
              ))}
            </form>
          </div>
        </div>
        {/* Left side end */}

        {/* Right side (product) */}
        <div className='px-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>
            Search Result: {data.length}
          </p>

          {/* Product */}
          <div className='min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] overflow-y-auto'>
            {data.length > 0 && <VerticalCard data={data} loading={loading} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
