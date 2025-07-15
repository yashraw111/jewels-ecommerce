import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, ShoppingCart } from "lucide-react"; // ShoppingCart icon import kiya
import { Link } from "react-router-dom";
import { fetchCart, toggleCart } from "../redux/cartSlice";
import { toast } from "react-toastify";

export default function ViewWishlist() {
  const user = useSelector((state) => state.user.user);
  const [wishlist, setWishlist] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user._id) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/wishlist/wishlist/${user._id}`);
      setWishlist(res.data.wishlist);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/toggle/${user._id}`, {
        userId: user._id,
        productId,
      });
      toast.success("Removed from wishlist");
      fetchWishlist();
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = (productId) => {
    if (!user) {
      return toast.warning("Please login first");
    }
    dispatch(toggleCart({ userId: user._id, productId }))
      .then(() => {
        toast.success("Added to cart");
        dispatch(fetchCart(user._id));
      })
      .catch(() => toast.error("Failed to add to cart"));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-2">Wishlist</h2>
      <p className="mb-6 text-gray-600">Home / Wishlist</p>

      {wishlist.length === 0 ? (
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
            {wishlist.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="py-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.productName}
                    className="w-20 h-20 object-cover"
                  />
                </td>
                <td>{product.productName}</td>
                <td>₹{product.productPrice?.toFixed(2)}</td>
                <td className="space-x-2 flex items-center">
                  <button
                    className="bg-purple-500 text-white p-2 rounded"
                    onClick={() => handleAddToCart(product._id)}
                    title="Add to Cart"
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
