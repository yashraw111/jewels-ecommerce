import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch, } from "react-redux";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import { fetchCart, toggleCart } from "../redux/cartSlice";
import { toast } from "react-toastify";

const LOCAL_WISHLIST_KEY = 'local_wishlist';

export default function ViewWishlist() {
  const user = useSelector((state) => state.user.user);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const dispatch = useDispatch();
  const redirect = useNavigate();

  // Helper to fetch product details for local storage IDs (individually)
  const fetchProductDetailsById = async (productId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${productId}`);
      return res.data; // This should be a single product object
    } catch (error) {
      console.error(`Error fetching product details for ID ${productId}:`, error);
      return null; // Return null if fetching fails
    }
  };

  useEffect(() => {
    const loadWishlist = async () => {
      if (user && user._id) {
        // Logged in: Fetch from backend (backend should return populated product objects)
        try {
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/wishlist/wishlist/${user._id}`);
          // Assuming backend returns actual product objects in res.data.wishlist
          setWishlistProducts(res.data.wishlist || []);
        } catch (err) {
          console.error("Failed to fetch backend wishlist", err);
          toast.error("Failed to load your saved wishlist.");
          setWishlistProducts([]); // Clear on error
        }
      } else {
        // Not logged in: Load from local storage and fetch details individually
        try {
          const storedWishlistIds = localStorage.getItem(LOCAL_WISHLIST_KEY);
          const productIds = storedWishlistIds ? JSON.parse(storedWishlistIds) : [];

          if (productIds.length > 0) {
            // Fetch full product details for each ID
            const detailedProductsPromises = productIds.map(id => fetchProductDetailsById(id));
            const detailedProducts = (await Promise.all(detailedProductsPromises)).filter(p => p !== null); // Filter out failed fetches
            console.log(detailedProducts)
            const filterData = detailedProducts.map((pr)=>{
              return pr.data
            })
            console.log(filterData)
            setWishlistProducts(filterData);
          } else {
            setWishlistProducts([]);
          }
        } catch (err) {
          console.error("Failed to load local wishlist", err);
          setWishlistProducts([]);
        }
      }
    };
    loadWishlist();
  }, [user]); // Re-run when user (login state) changes


  const handleRemoveFromWishlist = async (productId) => {
    if (user && user._id) {
      // Logged in: Remove from backend
      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/toggle`, { // Using toggle for consistency
          userId: user._id,
          productId,
        });
        toast.success("Removed from your saved wishlist!");
        // Update state to remove the product
        setWishlistProducts(prev => prev.filter(p => p._id !== productId));
      } catch (err) {
        toast.error("Failed to remove from saved wishlist.");
        console.error("Failed to remove from backend wishlist:", err);
      }
    } else {
      // Not logged in: Remove from local storage
      try {
        const storedWishlistIds = localStorage.getItem(LOCAL_WISHLIST_KEY);
        let currentWishlistIds = storedWishlistIds ? JSON.parse(storedWishlistIds) : [];
        const updatedWishlistIds = currentWishlistIds.filter(id => id !== productId);
        localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(updatedWishlistIds));
        setWishlistProducts(prev => prev.filter(p => p._id !== productId)); // Update UI immediately
        toast.success("Removed from local wishlist!");
      } catch (err) {
        toast.error("Failed to remove from local wishlist.");
        console.error("Failed to remove from local wishlist:", err);
      }
    }
  };

  const handleAddToCart = (productId) => {
    if (!user._id) {
      // Cart usually requires a logged-in user to manage state properly (backend cart)
      // return toast.warning("Please login to add to cart");
      return redirect("/login")
    }
    dispatch(toggleCart({ userId: user._id, productId }))
      .then(() => {
        toast.success("Added to cart");
        dispatch(fetchCart(user._id));
      })
      .catch((error) => {
        console.error("Failed to add to cart:", error);
        toast.error("Failed to add to cart");
      });
  };

  console.log(wishlistProducts)
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-2">Wishlist</h2>
      <p className="mb-6 text-gray-600">Home / Wishlist</p>

      {wishlistProducts.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlistProducts.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="py-3">
                  {/* Ensure product.images[0] exists before rendering */}
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.productName}
                      className="w-20 h-20 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Image</div> // Placeholder
                  )}
                </td>
                <td>{product.productName}</td>
                <td>₹{product.productPrice?.toFixed(2)}</td>
                <td className="space-x-2 flex items-center">
                  <button
                    className="bg-purple-500 text-white p-2 rounded"
                    onClick={() => handleAddToCart(product._id)}
                    title="Add to Cart"
                    // Optionally disable add to cart if not logged in
                    disabled={!user}
                  >
                    <ShoppingCart size={20} />
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="text-red-500 p-2 rounded"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/products">
        <button className="mt-4 border px-4 py-2 rounded flex items-center gap-2">
          &larr; Continue Shopping
        </button>
      </Link>
    </div>
  );
}