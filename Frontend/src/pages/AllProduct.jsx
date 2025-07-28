import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart, X, Filter } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for mobile filter panel

  const productsPerPage = 8;
  const user = useSelector((state) => state.user.user);

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
      try {
        localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Failed to save wishlist to local storage:", error);
      }
    }
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
            // This endpoint should be adapted to handle merging an array of product IDs
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/merge`, {
              userId: user._id,
              productIds: localWishlistItems,
            });
            setWishlist(res.data.wishlist);
            localStorage.removeItem(LOCAL_WISHLIST_KEY);
            toast.success("Your local wishlist has been merged!");
          } catch (err) {
            console.error("Failed to merge wishlist:", err);
          }
        } else {
          // If no local wishlist, just fetch user's current wishlist
          try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/wishlist/wishlist/${user._id}`);
            setWishlist(res.data.wishlist || []);
          } catch (err) {
            console.error("Failed to fetch user's wishlist:", err);
          }
        }
      }
    };
    mergeWishlistOnLogin();
  }, [user]);

  // Shuffle function (Fisher-Yates)
  const shuffleArray = useCallback((array) => {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // Fetch Products & Categories
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL_PRO}`),
          axios.get(`${import.meta.env.VITE_BASE_URL_CAT}`),
        ]);
        setAllProducts(shuffleArray(productsRes.data));
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load page data.");
      }
    }
    fetchData();
  }, [shuffleArray]);

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
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  const resetFilters = () => {
    setFilters({
        categories: [],
        materials: [],
        minPrice: 0,
        maxPrice: 200000,
    });
    setSearchQuery("");
    setCurrentPage(1);
  }

  const handleWishlistToggle = async (productId) => {
    if (user && user._id) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/toggle`, {
          userId: user._id,
          productId,
        });
        setWishlist(res.data.wishlist);
        toast.success(res.data.message);
      } catch (err) {
        console.error("Wishlist toggle failed:", err);
        toast.error("Failed to update wishlist.");
      }
    } else {
      setWishlist((prev) => {
        const isLiked = prev.includes(productId);
        const updated = isLiked ? prev.filter((id) => id !== productId) : [...prev, productId];
        toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist");
        return updated;
      });
    }
  };

  const filteredProducts = allProducts.filter((product) => {
    const inCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
    const inMaterial = filters.materials.length === 0 || filters.materials.includes(product.material);
    const inPriceRange = product.productPrice >= filters.minPrice && product.productPrice <= filters.maxPrice;
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return inCategory && inMaterial && inPriceRange && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  
  const activeFilterCount = filters.categories.length + filters.materials.length + (filters.minPrice > 0 ? 1 : 0) + (filters.maxPrice < 200000 ? 1 : 0) + (searchQuery ? 1 : 0);

  const FilterSidebar = () => (
    <aside className="w-full h-full overflow-y-auto bg-white p-6 flex flex-col">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="font-bold text-xl text-gray-800">Filters</h2>
        <button onClick={() => setIsFilterOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-grow">
        {/* Search Bar */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">Search Products</h3>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-800"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">Categories</h3>
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`category-${cat._id}`}
                className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                onChange={() => handleCheckbox("categories", cat._id)}
                checked={filters.categories.includes(cat._id)}
              />
              <label htmlFor={`category-${cat._id}`} className="text-gray-700 cursor-pointer select-none">
                {cat.cat_name}
              </label>
            </div>
          ))}
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">Price Range</h3>
          <div className="flex items-center gap-2">
            <input type="number" name="minPrice" placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-800" onChange={handlePriceChange} value={filters.minPrice}/>
            <span className="text-gray-500">-</span>
            <input type="number" name="maxPrice" placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-800" onChange={handlePriceChange} value={filters.maxPrice}/>
          </div>
        </div>

        {/* Materials */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">Material</h3>
          {["18K Gold", "22K Gold", "Rose Gold", "White Gold"].map((mat) => (
            <div key={mat} className="flex items-center mb-2">
              <input type="checkbox" id={`material-${mat}`} className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" onChange={() => handleCheckbox("materials", mat)} checked={filters.materials.includes(mat)} />
              <label htmlFor={`material-${mat}`} className="text-gray-700 cursor-pointer select-none">{mat}</label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="border-t pt-4 mt-4 space-y-2">
         <button onClick={() => setIsFilterOpen(false)} className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm font-medium lg:hidden">
            Show {filteredProducts.length} Products
         </button>
         <button onClick={resetFilters} className="w-full bg-gray-200 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium">
            Clear Filters
         </button>
      </div>
    </aside>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Backdrop */}
          {isFilterOpen && <div onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />}

          {/* Mobile Filter Panel */}
          <div className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white z-50 transform shadow-xl ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
            <FilterSidebar />
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
             <div className="sticky top-24">
                <FilterSidebar />
             </div>
          </div>

          {/* Product Grid */}
          <main className="flex-1">
             <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">All Products</h1>
                    <p className="text-gray-600 mt-1">{filteredProducts.length} products found</p>
                </div>
                <button onClick={() => setIsFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 relative">
                    <Filter size={18} />
                    <span>Filters</span>
                    {activeFilterCount > 0 && <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{activeFilterCount}</span>}
                </button>
             </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-600 text-xl py-20 bg-white rounded-lg shadow">
                <p className="font-semibold">No products found</p>
                <p className="text-base mt-2">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {displayedProducts.map((product) => {
                    const isLiked = wishlist.includes(product._id);
                    return (
                      <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group flex flex-col">
                        <div className="absolute top-2 right-2 z-10">
                           <button onClick={() => handleWishlistToggle(product._id)} title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"} className={`p-2 rounded-full shadow-md transition-all duration-300 ${ isLiked ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-red-100" }`}>
                              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                           </button>
                        </div>
                        <Link to={`/product/${product._id}`} className="block">
                          <img src={product.images?.[0] || "https://placehold.co/400x400/f0f0f0/333?text=No+Image"} alt={product.productName} className="w-full h-48 sm:h-56 object-cover object-center transform group-hover:scale-105 transition-transform duration-300" />
                        </Link>
                        <div className="p-3 sm:p-4 text-center flex-grow flex flex-col justify-between">
                           <div>
                              <Link to={`/product/${product._id}`} className="block">
                                <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 line-clamp-2 hover:text-purple-600">{product.productName}</h3>
                              </Link>
                              <p className="text-purple-700 font-bold text-base sm:text-lg mb-2">₹{product.productPrice?.toLocaleString()}</p>
                           </div>
                           <Link to={`/product/${product._id}`} className="mt-auto">
                              <button className="w-full bg-purple-100 text-purple-700 py-2 px-3 rounded-md hover:bg-purple-600 hover:text-white transition-colors duration-300 text-xs sm:text-sm font-semibold">
                                View Details
                              </button>
                           </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10 gap-2 sm:gap-3 items-center">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentPage === 1}>Previous</button>
                    <span className="px-4 py-2 text-gray-700 font-medium text-sm">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentPage === totalPages}>Next</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
