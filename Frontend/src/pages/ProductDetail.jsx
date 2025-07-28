import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleCart, fetchCart } from "../redux/cartSlice";
import ReviewModal from "../components/ReviewModal";

// Skeleton Loader Component for a more polished loading state
const ProductDetailSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
                <div className="bg-gray-200 w-full h-96 rounded-lg"></div>
                <div className="flex gap-4 mt-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                    <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                    <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mt-4"></div>
                <div className="flex gap-2">
                    <div className="w-16 h-10 bg-gray-200 rounded"></div>
                    <div className="w-16 h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded w-full mt-4"></div>
            </div>
        </div>
    </div>
);


const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [selectedImage, setSelectedImage] = useState("");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [notifyEmail, setNotifyEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const imgRef = useRef(null);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const cartItems = useSelector((state) => state.cart.items);

    const fetchProductData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${id}`);
            const prod = res.data.data;
            setProduct(prod);
            setSelectedMaterial(prod.material || "18k Gold");
            if (prod.sizes && prod.sizes.length > 0) {
                // Select the first available size by default
                const firstAvailableSize = prod.sizes.find(s => s.quantity > 0) || prod.sizes[0];
                setSelectedSize(firstAvailableSize.size);
            }
            setSelectedImage(prod.images?.[0] || "");
            setAllReviews(prod.reviews || []);
        } catch (err) {
            console.error("Failed to fetch product:", err);
            toast.error("Could not load product details.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        fetchProductData();
    }, [id, fetchProductData]);

    useEffect(() => {
        if (user && user.email) {
            setNotifyEmail(user.email);
        } else {
            setNotifyEmail("");
        }
    }, [user]);

    useEffect(() => {
        if (user && user._id) {
            dispatch(fetchCart(user._id));
        }
    }, [user, dispatch]);

    useEffect(() => {
        async function fetchRelated() {
            if (product?._id) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${product._id}/related`);
                    setRelatedProducts(res.data.products);
                } catch (err) {
                    console.error("Failed to fetch related products:", err);
                }
            }
        }
        fetchRelated();
    }, [product]);
    
    // Reset quantity to 1 when size changes
    useEffect(() => {
        setQuantity(1);
    }, [selectedSize]);

    const handleMouseMove = (e) => {
        if (!imgRef.current) return;
        const { left, top, width, height } = imgRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPosition({ backgroundPosition: `${x}% ${y}%` });
    };

    if (isLoading) return <ProductDetailSkeleton />;
    if (!product) return <div className="text-center py-20 text-lg font-semibold text-gray-600">Product not found.</div>;

    const currentSizeInfo = product.sizes.find(s => s.size === selectedSize);
    const currentSizeQuantity = currentSizeInfo ? currentSizeInfo.quantity : 0;
    const isSelectedSizeOutOfStock = currentSizeQuantity <= 0;

    const inCart = cartItems.some(item =>
        item.productId._id === product._id &&
        item.material === selectedMaterial &&
        item.size === selectedSize
    );

    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            if (quantity < currentSizeQuantity) {
                setQuantity(q => q + 1);
            } else {
                toast.info(`Only ${currentSizeQuantity} items available in stock.`);
            }
        } else {
            setQuantity(q => Math.max(1, q - 1));
        }
    };

    const handleCartToggle = async () => {
        if (!user || !user._id) return toast.warning("Please login to manage your cart.");
        if (isSelectedSizeOutOfStock) return toast.error("This size is out of stock.");
        if (quantity > currentSizeQuantity) return toast.error("Requested quantity exceeds available stock.");

        try {
            await dispatch(toggleCart({
                userId: user._id,
                productId: product._id,
                material: selectedMaterial,
                size: selectedSize,
                quantity,
            })).unwrap(); // Use unwrap to catch errors from createAsyncThunk

            toast.success(inCart ? "Removed from cart" : "Added to cart!");
            // Re-fetch product to get the latest stock info after cart action
            fetchProductData(); 
        } catch (err) {
            toast.error("Failed to update cart.");
            console.error(err);
        }
    };

    const handleSubmitReview = async ({ rating, comment }) => {
        if (!user?._id) return toast.warn("Please login to write a review.");
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL_PRO}/${product._id}/review`, {
                rating, comment, name: user.name, userId: user._id,
            });
            toast.success("Review submitted!");
            fetchProductData(); // Re-fetch to show new review
        } catch (err) {
            toast.error("Error submitting review.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!user) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL_PRO}/${product._id}/review/${reviewId}`);
            toast.success("Review deleted!");
            fetchProductData(); // Re-fetch to remove review
        } catch (err) {
            toast.error("Failed to delete review.");
        }
    };
    
    const handleNotifyMe = async () => {
        if (!notifyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
            return toast.error("Please enter a valid email address.");
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/notify`, {
                productId: product._id, size: selectedSize, email: notifyEmail,
            });
            toast.success(res.data.message || "We'll notify you!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not submit request.");
        }
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-purple-600">Home</Link> / <Link to="/products" className="hover:text-purple-600">Products</Link> / {product.productName}
                </p>
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div ref={imgRef} onMouseMove={handleMouseMove} className="relative w-full h-96 overflow-hidden shadow-lg group cursor-zoom-in">
                            <img src={selectedImage} alt="Product" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `url(${selectedImage})`, backgroundSize: '200%', ...zoomPosition }} />
                        </div>
                        <div className="flex gap-4 mt-4">
                            {product.images?.map((img, i) => (
                                <img key={i} src={img} alt={`Thumbnail ${i + 1}`} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all ${selectedImage === img ? "border-purple-600 scale-105" : "border-transparent hover:border-purple-400"}`} onClick={() => setSelectedImage(img)} />
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{product.productName}</h1>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 text-yellow-500">
                                {[...Array(Math.round(product.rate || 4))].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                {[...Array(5 - Math.round(product.rate || 4))].map((_, i) => <Star key={i} size={18} className="text-gray-300" />)}
                            </div>
                            <a href="#reviews" className="text-sm text-gray-600 hover:text-purple-600">{allReviews.length} Reviews</a>
                        </div>
                        <p className="text-3xl font-bold text-purple-600 mb-4">₹{product.productPrice?.toLocaleString()}</p>
                        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                        <div className="space-y-6">
                            {/* Material Selector */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Material: <span className="font-normal text-gray-600">{selectedMaterial}</span></h4>
                                <div className="flex flex-wrap gap-2">
                                    {["18k Gold", "22K Gold", "Rose Gold"].map((mat) => (
                                        <button key={mat} onClick={() => setSelectedMaterial(mat)} className={`px-4 py-2 border rounded-full text-sm font-medium transition-all ${selectedMaterial === mat ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-700 hover:border-purple-500"}`}>{mat}</button>
                                    ))}
                                </div>
                            </div>
                            {/* Size Selector */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Size: <span className="font-normal text-gray-600">{selectedSize}</span></h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes?.map((s) => (
                                        <button key={s.size} onClick={() => setSelectedSize(s.size)} disabled={s.quantity === 0} className={`px-4 py-2 border rounded-full text-sm font-medium transition-all relative ${selectedSize === s.size ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-700 hover:border-purple-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"}`}>
                                            {s.size}
                                            {s.quantity === 0 && <div className="absolute -top-1 -right-1 w-full h-px bg-red-500 transform rotate-[-20deg]"></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stock and Action Section */}
                        <div className="mt-6 pt-6 border-t">
                            {isSelectedSizeOutOfStock ? (
                                <div className="p-4 border border-yellow-400 rounded-lg bg-yellow-50">
                                    <p className="font-semibold text-yellow-800 mb-2">Size {selectedSize} is currently out of stock.</p>
                                    <p className="text-sm text-yellow-700 mb-3">Enter your email to be notified when it's back!</p>
                                    <div className="flex gap-2">
                                        <input type="email" placeholder="Your email" className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} />
                                        <button onClick={handleNotifyMe} className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">Notify Me</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold text-gray-800">Quantity</h4>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => handleQuantityChange('decrease')} className="w-8 h-8 border rounded-full text-lg text-gray-600 hover:bg-gray-100">-</button>
                                            <span className="font-bold text-lg">{quantity}</span>
                                            <button onClick={() => handleQuantityChange('increase')} className="w-8 h-8 border rounded-full text-lg text-gray-600 hover:bg-gray-100">+</button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-green-600 mb-4 font-medium flex items-center gap-2"><CheckCircle size={16} /> Only {currentSizeQuantity} items left in stock!</p>
                                    <button onClick={handleCartToggle} className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700">
                                        {inCart ? <XCircle /> : <Heart />}
                                        {inCart ? "Remove from Cart" : "Add to Cart"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Tabs */}
                <div id="reviews" className="mt-12 lg:mt-16">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex gap-6" aria-label="Tabs">
                            {["description", "specifications", "reviews"].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{tab}</button>
                            ))}
                        </nav>
                    </div>
                    <div className="py-6">
                        {activeTab === 'description' && <p className="text-gray-600 leading-relaxed">{product.description}</p>}
                        {activeTab === 'specifications' && <ul className="list-disc list-inside text-gray-600 space-y-2"><li>Material: {product.material}</li><li>Weight: {product.weight}g</li><li>Warranty: 2 years</li></ul>}
                        {activeTab === 'reviews' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Customer Reviews</h3>
                                    {user && <button onClick={() => setIsReviewModalOpen(true)} className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700">Write a Review</button>}
                                </div>
                                <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} onSubmit={handleSubmitReview} />
                                {allReviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {allReviews.map((r) => (
                                            <div key={r._id} className="border-b pb-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-yellow-500">{[...Array(r.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                                                    {user && user._id === r.userId && <button onClick={() => handleDeleteReview(r._id)} className="text-red-500 text-xs hover:underline">Delete</button>}
                                                </div>
                                                <p className="font-semibold mt-1">{r.name}</p>
                                                <p className="text-gray-600 mt-1 italic">"{r.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-gray-500">No reviews yet. Be the first!</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-12 lg:mt-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
                    {relatedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <Link to={`/product/${p._id}`} key={p._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                                    <img src={p.images?.[0]} alt={p.productName} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform" />
                                    <div className="p-4 text-center">
                                        <h4 className="font-semibold text-gray-800 truncate">{p.productName}</h4>
                                        <p className="text-purple-600 font-bold mt-1">₹{p.productPrice?.toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : <p className="text-gray-500">No related products found.</p>}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
