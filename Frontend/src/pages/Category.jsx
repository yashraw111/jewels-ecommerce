import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL_CAT}`)
      .then(async (res) => {
        const cats = res.data;
        setCategories(cats);

        // Fetch product count for each category
        const counts = {};
        await Promise.all(
          cats.map(async (cat) => {
            try {
              const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL_PRODUCT}?categoryId=${cat._id}`
              );
              counts[cat._id] = res.data.length; // assuming array of products
            } catch (err) {
              counts[cat._id] = 0;
            }
          })
        );
        setProductCounts(counts);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-2">Browse Categories</h2>
      <p className="text-sm text-gray-500 mb-6">Home / Category</p>

      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => navigate(`/categoryPr/${cat._id}`)}
              className="group relative h-48 cursor-pointer bg-gray-100 rounded overflow-hidden shadow"
            >
              <img
                src={cat.cat_image}
                alt={cat.cat_name}
                className="w-full h-full object-cover transition-all duration-500 filter blur-[1px] group-hover:blur-[0px] group-hover:scale-110"
              />

              <div className="absolute inset-0  bg-opacity-30 flex items-center justify-center flex-col text-white">
                <h3 className="text-lg font-semibold">{cat.cat_name}</h3>
                {/* <p className="text-sm">42 Product</p> static for now */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
};

export default Category;
