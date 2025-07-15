import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Heart } from "lucide-react";
import Container from "./Container";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, toggleCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart(user._id));
      fetchWishlist();
    }
  }, [user, dispatch]);

  async function fetchWishlist() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/wishlist/wishlist/${user._id}`);
      setWishlist(res.data.wishlist);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  }

  async function toggleWishlist(productId) {
    if (!user || !user._id) {
      toast.warning("Please login to manage wishlist");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/toggle`, {
        userId: user._id,
        productId,
      });
      fetchWishlist();
    } catch (err) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist error:", err);
    }
  }

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}?new=true`);
        setProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      }
    }
    fetchNewArrivals();
  }, []);

  return (
    <section className="bg-[#f1f6fd] py-16 px-4">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">New Arrivals</h2>
              <p className="text-gray-600">Fresh styles just in! Shop the latest arrivals now.</p>
            </div>
            <Link to="/products">
              <button className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => {
              const isInCart = cartItems.some((item) => item.productId._id === product._id);
              const isLiked = wishlist.some((item) => item._id === product._id);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-md shadow-sm overflow-hidden border border-purple-100 group relative transition-all duration-300"
                >
                  {/* Like Icon only visible on hover */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow  group-hover:flex transition duration-300 z-10"
                  >
                    <Heart
                      size={20}
                      strokeWidth={2.5}
                      className={isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}
                    />
                  </button>

                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/200"}
                      alt={product.productName}
                      className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="p-4 relative">
                    {/* Add to Cart button - hidden by default, visible on hover with animation */}
                    <button
                      className={`absolute left-1/2 transform -translate-x-1/2 bottom-16 flex justify-center items-center gap-2 text-sm py-2 px-4 rounded-md font-medium
                        transition-all duration-300 opacity-0 translate-y-4
                        group-hover:opacity-100 group-hover:translate-y-0
                        ${isInCart ? "bg-red-500 text-white" : "bg-purple-600 text-white"}
                      `}
                      onClick={() => {
                        if (!user || !user._id) {
                          toast.warning("Please login to add product to cart");
                          return;
                        }

                        dispatch(toggleCart({ userId: user._id, productId: product._id }))
                          .then(() => {
                            toast.success(isInCart ? "Removed from cart" : "Added to cart");
                            dispatch(fetchCart(user._id));
                          })
                          .catch(() => toast.error("Cart update failed"));
                      }}
                    >
                      <ShoppingCart />
                      {isInCart ? "Remove from Cart" : "Add to Cart"}
                    </button>

                    {/* Product name and price always visible */}
                    <h3 className="text-sm font-semibold">{product.productName}</h3>
                    <p className="text-sm text-purple-600 font-semibold">₹{product.productPrice}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NewArrivals;
