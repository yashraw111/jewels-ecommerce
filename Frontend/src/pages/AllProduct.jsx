import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

// Define a key for local storage
const LOCAL_WISHLIST_KEY = 'local_wishlist';

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
  const user = useSelector((state) => state.user.user);
  // New state for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize wishlist from user data or local storage
  const [wishlist, setWishlist] = useState(() => {
    if (user && user._id) {
      return user.wishlist || [];
    } else {
      try {
        const storedWishlist = localStorage.getItem(LOCAL_WISHLIST_KEY);
        return storedWishlist ? JSON.parse(storedWishlist) : [];
      } catch (error) {
        console.error("Failed to parse local wishlist:", error);
        return [];
      }
    }
  });

  // Effect to sync local storage wishlist to state and vice versa
  useEffect(() => {
    if (!user || !user._id) {
      // If not logged in, sync component state to local storage
      try {
        localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Failed to save wishlist to local storage:", error);
      }
    }
    // If logged in, wishlist is managed by backend and `mergeWishlistOnLogin` useEffect
  }, [wishlist, user]);

  // Effect to merge local wishlist with user's wishlist on login
  useEffect(() => {
    const mergeWishlistOnLogin = async () => {
      if (user && user._id) {
        let localWishlistItems = [];
        try {
          const storedWishlist = localStorage.getItem(LOCAL_WISHLIST_KEY);
          localWishlistItems = storedWishlist ? JSON.parse(storedWishlist) : [];
        } catch (error) {
          console.error("Failed to read local wishlist for merge:", error);
        }

        if (localWishlistItems.length > 0) {
          try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/`, {
              userId: user._id,
              localWishlist: localWishlistItems,
            });
            setWishlist(res.data.updatedWishlist);
            localStorage.removeItem(LOCAL_WISHLIST_KEY);
            toast.success("Your local wishlist has been merged!");
          } catch (err) {
            console.error("Failed to merge wishlist:", err);
            // Optionally, show a more user-friendly error or log
          }
        } else {
          // If no local wishlist, just fetch user's current wishlist to ensure state is accurate
          try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/wishlist/wishlist/${user._id}`);
            setWishlist(res.data.wishlist);
          } catch (err) {
            console.error("Failed to fetch user's wishlist:", err);
          }
        }
      }
    };
    mergeWishlistOnLogin();
  }, [user]);

  // Shuffle function (Fisher-Yates) - wrapped in useCallback for performance
  const shuffleArray = useCallback((array) => {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // Fetch Products & shuffle on fetch
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}`);
        const shuffledProducts = shuffleArray(res.data);
        setAllProducts(shuffledProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("Failed to load products.");
      }
    }
    fetchProducts();
  }, [shuffleArray]);

  // Fetch Categories
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    async function fetchCategories() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_CAT}`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories.");
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

  // New handler for search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleWishlistToggle = async (productId) => {
    if (user && user._id) {
      // Logged-in user: interact with backend
      try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/toggle`, {
          userId: user._id,
          productId,
        });
        setWishlist(res.data.wishlist); // Update state from backend response
        toast.success(res.data.message);
      } catch (err) {
        console.error("Wishlist toggle failed (backend):", err);
        toast.error("Failed to update wishlist on server");
      }
    } else {
      // Not logged-in: interact with local storage
      setWishlist((prevWishlist) => {
        const isCurrentlyLiked = prevWishlist.includes(productId);
        let updatedWishlist;
        let message;

        if (isCurrentlyLiked) {
          updatedWishlist = prevWishlist.filter((id) => id !== productId);
          message = "Removed from local wishlist";
        } else {
          updatedWishlist = [...prevWishlist, productId];
          message = "Added to local wishlist";
        }
        toast.success(message);
        return updatedWishlist; // This will trigger the `useEffect` to save to local storage
      });
    }
  };

  // Filter products based on filters and search query
  const filteredProducts = allProducts.filter((product) => {
    const inCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    const inMaterial =
      filters.materials.length === 0 || filters.materials.includes(product.material);

    const inPriceRange =
      product.productPrice >= filters.minPrice &&
      product.productPrice <= filters.maxPrice;

    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());

    return inCategory && inMaterial && inPriceRange && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 p-6 bg-white shadow-lg border border-gray-200">
          <h2 className="font-bold text-xl mb-6 text-gray-800 border-b pb-3">Filters</h2>

          {/* Search Bar */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">Search Products</h3>
            <input
              type="text"
              placeholder="Search by product name..."
              className="w-full p-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">Categories</h3>
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`category-${cat._id}`}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 "
                  onChange={() => handleCheckbox("categories", cat._id)}
                />
                <label htmlFor={`category-${cat._id}`} className="text-gray-700 cursor-pointer">
                  {cat.cat_name}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">Price Range</h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                className="w-1/2 p-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                onChange={handlePriceChange}
                value={filters.minPrice}
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                className="w-1/2 p-2 border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                onChange={handlePriceChange}
                defaultValue={200000}
                value={filters.maxPrice}
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">Material</h3>
            {["18K Gold", "22K Gold", "Rose Gold", "White Gold"].map((mat) => (
              <div key={mat} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`material-${mat}`}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 "
                  onChange={() => handleCheckbox("materials", mat)}
                />
                <label htmlFor={`material-${mat}`} className="text-gray-700 cursor-pointer">
                  {mat}
                </label>
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-600 text-xl py-10">
              No products found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProducts.map((product) => {
                const isLiked = wishlist.includes(product._id);
                return (
                  <div
                    key={product._id}
                    className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative group"
                  >
                    {/* Wishlist Heart */}
                    <div
                      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      onClick={() => handleWishlistToggle(product._id)}
                      title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <div
                        className={`p-2 shadow-md ${
                          isLiked ? "bg-red-500 hover:bg-red-600" : "bg-gray-200 hover:bg-gray-300"
                        } transition-colors duration-200`}
                      >
                        <Heart strokeWidth={2.5} size={20} className={isLiked ? "text-white" : "text-gray-700"} />
                      </div>
                    </div>

                    <Link to={`/product/${product._id}`} className="block">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={product.productName}
                        className="w-full h-56 object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <div className="p-4 text-center">
                      <Link to={`/product/${product._id}`} className="block">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                          {product.productName}
                        </h3>
                      </Link>
                      <p className="text-purple-700 font-bold text-xl mb-3">
                        ₹ {product.productPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>

                      <Link to={`/product/${product._id}`}>
                        <button className="w-full bg-purple-600 text-white py-2 px-4 hover:bg-purple-700 transition-colors duration-200 text-sm font-medium">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}


          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-3 items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-5 py-2 border border-purple-400 text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-5 py-2 border border-purple-400 text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}