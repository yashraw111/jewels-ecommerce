import { useEffect, useState, memo, useCallback } from "react";
import axios from "axios";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import Container from "./Container";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, toggleCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Define a key for local storage for guest wishlist
const LOCAL_WISHLIST_KEY_NEW_ARRIVALS = 'local_wishlist_new_arrivals';

// A memoized Product Card component to prevent unnecessary re-renders and handle its own logic.
const ProductCard = memo(({ product, onWishlistToggle, onCartToggle, isLiked, isInCart }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
            {/* Wishlist Button */}
            <button
                onClick={() => onWishlistToggle(product._id)}
                title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all duration-300 ${
                    isLiked ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-red-100"
                }`}
            >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>

            <Link to={`/product/${product._id}`} className="block">
                <img
                    src={product.images?.[0] || "https://placehold.co/400x400/f0f0f0/333?text=No+Image"}
                    alt={product.productName}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </Link>

            <div className="p-4 text-left">
                <Link to={`/product/${product._id}`} className="block">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate mb-1 hover:text-purple-600">
                        {product.productName}
                    </h3>
                </Link>
                <p className="text-base text-purple-600 font-bold">
                    ₹{product.productPrice?.toLocaleString()}
                </p>

                {/* Add to Cart Icon Button - Always visible, perfect for mobile */}
                <button
                    onClick={() => onCartToggle(product._id)}
                    title={isInCart ? "Remove from Cart" : "Add to Cart"}
                    className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isInCart ? "bg-red-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                >
                    <ShoppingCart size={20} />
                </button>
            </div>
        </div>
    );
});

// Skeleton loader for a polished loading state
const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-52 bg-gray-200"></div>
        <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const cartItems = useSelector((state) => state.cart.items);

    // Fetch wishlist from backend or local storage
    const fetchWishlist = useCallback(async () => {
        if (user && user._id) {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/wishlist/wishlist/${user._id}`);
                setWishlist(res.data.wishlist.map(item => item._id)); // Store only IDs
            } catch (err) {
                console.error("Failed to fetch wishlist:", err);
            }
        } else {
            const localWishlist = JSON.parse(localStorage.getItem(LOCAL_WISHLIST_KEY_NEW_ARRIVALS) || "[]");
            setWishlist(localWishlist);
        }
    }, [user]);

    useEffect(() => {
        if (user && user._id) {
            dispatch(fetchCart(user._id));
        }
        fetchWishlist();
    }, [user, dispatch, fetchWishlist]);

    // Handle wishlist toggle for both logged-in and guest users
    const handleWishlistToggle = async (productId) => {
        if (user && user._id) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/wishlist/toggle`, {
                    userId: user._id,
                    productId,
                });
                toast.success(res.data.message);
                fetchWishlist(); // Re-fetch to update state
            } catch (err) {
                toast.error("Failed to update wishlist");
            }
        } else {
            // Handle guest wishlist in local storage
            const updatedWishlist = wishlist.includes(productId)
                ? wishlist.filter(id => id !== productId)
                : [...wishlist, productId];
            
            localStorage.setItem(LOCAL_WISHLIST_KEY_NEW_ARRIVALS, JSON.stringify(updatedWishlist));
            setWishlist(updatedWishlist);
            toast.success(wishlist.includes(productId) ? "Removed from wishlist" : "Added to wishlist");
        }
    };

    // Handle cart toggle
    const handleCartToggle = async (productId) => {
        if (!user || !user._id) {
            return toast.warning("Please login to manage your cart");
        }
        try {
            const isInCart = cartItems.some((item) => item.productId._id === productId);
            await dispatch(toggleCart({ userId: user._id, productId })).unwrap();
            toast.success(isInCart ? "Removed from cart" : "Added to cart");
        } catch (err) {
            toast.error("Failed to update cart");
        }
    };

    useEffect(() => {
        async function fetchNewArrivals() {
            setIsLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}?new=true`);
                setProducts(res.data.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch new arrivals:", err);
                toast.error("Could not load new arrivals.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchNewArrivals();
    }, []);

    return (
        <section className="bg-purple-50 py-16">
            <Container>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">New Arrivals</h2>
                        <p className="text-gray-600 mt-1">Fresh styles just in! Shop the latest arrivals now.</p>
                    </div>
                    <Link to="/products" className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                        <span>View All</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {isLoading
                        ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
                        : products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onWishlistToggle={handleWishlistToggle}
                                onCartToggle={handleCartToggle}
                                isLiked={wishlist.includes(product._id)}
                                isInCart={cartItems.some((item) => item.productId._id === product._id)}
                            />
                        ))}
                </div>
            </Container>
        </section>
    );
};

export default NewArrivals;
