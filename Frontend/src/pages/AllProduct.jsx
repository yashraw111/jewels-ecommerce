import { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export default function AllProducts() {
  const [filters, setFilters] = useState({
    categories: [],
    materials: [],
    minPrice: 0,
    maxPrice: 200000,
  });

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // ✅ Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}`);
        setAllProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
    fetchProducts();
  }, []);

  // ✅ Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_CAT}`);
        setCategories(res.data); // [{ _id, cat_name }]
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleCheckbox = (type, value) => {
    setFilters((prev) => {
      const updated = prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    setCurrentPage(1);
  };

  const filteredProducts = allProducts.filter((product) => {
    const inCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category); // ✅ category is ID

    const inMaterial =
      filters.materials.length === 0 ||
      filters.materials.includes(product.material);

    const inPriceRange =
      product.productPrice >= filters.minPrice &&
      product.productPrice <= filters.maxPrice;

    return inCategory && inMaterial && inPriceRange;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="flex px-6 py-8 gap-6">
      {/* Sidebar */}
      <aside className="w-64 border border-purple-200 p-4">
        <h2 className="font-bold text-lg mb-2">Categories</h2>
        {categories.map((cat) => (
          <div key={cat._id}>
            <input
              type="checkbox"
              onChange={() => handleCheckbox("categories", cat._id)}
            /> {cat.cat_name}
          </div>
        ))}

        <h2 className="font-bold text-lg mt-6 mb-2">Price Range</h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            className="w-1/2 border p-1"
            onChange={handlePriceChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            className="w-1/2 border p-1"
            onChange={handlePriceChange}
            defaultValue={200000}
          />
        </div>

        <h2 className="font-bold text-lg mt-6 mb-2">Material</h2>
        {["18K Gold", "22K Gold", "Rose Gold", "White Gold"].map((mat) => (
          <div key={mat}>
            <input
              type="checkbox"
              onChange={() => handleCheckbox("materials", mat)}
            /> {mat}
          </div>
        ))}
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayedProducts.map((product) => (
            <Link to={`/product/${product._id}`}>
            <div
              key={product._id}
              className="border border-purple-200 shadow p-4 text-center"
              >
              
              <img
                src={product.images?.[0] || ""}
                alt={product.productName}
                className="w-full h-48 object-cover mb-2"
              />
              <h3 className="font-semibold">{product.productName}</h3>
              <p className="text-purple-600 font-bold">
                ₹ {product.productPrice?.toFixed(2)}
              </p>
              <button className="mt-2 bg-purple-600 text-white px-4 py-1 ">
                Add to Cart
              </button>
            </div>
                  </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-4 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
