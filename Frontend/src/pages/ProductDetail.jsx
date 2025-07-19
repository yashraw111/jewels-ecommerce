import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleCart, fetchCart } from "../redux/cartSlice";
import ReviewModal from "../components/ReviewModal";

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
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [zoomBackgroundPos, setZoomBackgroundPos] = useState("0% 0%");
  const [currentSizeQuantity, setCurrentSizeQuantity] = useState(0); // State for selected size quantity
  const [notifyEmail, setNotifyEmail] = useState(""); // State for notification email

  const imgRef = useRef(null);
  const zoomRef = useRef(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.items);
  const tabs = ["description", "specifications", "reviews"];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    async function fetchProduct() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${id}`);
        const prod = res.data.data;
        setProduct(prod);
        setSelectedMaterial(prod.material || "18k Gold");
        // Set initial selected size to the first available size, or 'M' as a fallback
        // And ensure it's a size that exists in product.sizes
        const initialSize = prod.sizes?.[0]?.size || "M";
        setSelectedSize(initialSize);
        setSelectedImage(prod.images?.[0] || "");
        setAllReviews(prod.reviews || []);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }
    fetchProduct();
  }, [id]);

  // Effect to update current size quantity when product or selected size changes
  // And to reset quantity to 1 if the selected size changes
  useEffect(() => {
    if (product && selectedSize) {
      const foundSize = product.sizes.find(s => s.size === selectedSize);
      setCurrentSizeQuantity(foundSize ? foundSize.quantity : 0);
      setQuantity(1); // Reset quantity when size changes
    }
  }, [product, selectedSize]);

  // Effect to set notifyEmail if user is logged in
  useEffect(() => {
    if (user && user.email) {
      setNotifyEmail(user.email);
    } else {
      setNotifyEmail(""); // Clear if logged out
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart(user._id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL_PRO}/${product._id}/related`
        );
        setRelatedProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      }
    }

    if (product?._id) {
      fetchRelated();
    }
  }, [product]);

  // Magnifying glass effect handlers
  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current || !zoomRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomPosition({
      x: e.pageX - left - zoomRef.current.offsetWidth / 2,
      y: e.pageY - top - zoomRef.current.offsetHeight / 2
    });

    setZoomBackgroundPos(`${x}% ${y}%`);
  };

  if (!product) return <div className="text-center py-10 text-lg">Loading...</div>;

  const inCart = cartItems.some(
    (item) =>
      item.productId._id === product._id &&
      item.material === selectedMaterial &&
      item.size === selectedSize
  );

  // Determine if the currently selected size is out of stock
  const isSelectedSizeOutOfStock = currentSizeQuantity <= 0;

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      if (quantity < currentSizeQuantity) {
        setQuantity(q => q + 1);
      } else {
        toast.info("Cannot add more than available stock.");
      }
    } else {
      setQuantity(q => Math.max(1, q - 1));
    }
  };

  const handleCartToggle = async () => {
    if (!user || !user._id) {
      toast.warning("Please login to add product to cart");
      return;
    }

    if (isSelectedSizeOutOfStock) {
      toast.error("This item is currently out of stock for the selected size.");
      return;
    }

    if (quantity > currentSizeQuantity) {
      toast.error("Requested quantity exceeds available stock.");
      return;
    }

    try {
      await dispatch(
        toggleCart({
          userId: user._id,
          productId: product._id,
          material: selectedMaterial,
          size: selectedSize,
          quantity,
        })
      );

      if (!inCart) {
        const decrementRes = await axios.post(`${import.meta.env.VITE_BASE_URL_PRO}/decrement-stock`, {
          productId: product._id,
          size: selectedSize,
          quantityOrdered: quantity,
        });
        if (decrementRes.data.success) {
          toast.success("Product added to cart and stock updated!");
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${id}`);
          setProduct(res.data.data); // Re-fetch product details to reflect updated stock
        } else {
          toast.error(decrementRes.data.message || "Failed to update stock.");
        }
      } else {
        toast.success("Removed from cart");
      }
      dispatch(fetchCart(user._id));
    } catch (err) {
      toast.error("Failed to update cart or stock");
      console.error(err);
    }
  };

  const handleSubmitReview = async ({ rating, comment }) => {
    if (!user?._id) return toast.warn("Please login to write a review");

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL_PRO}/${product._id}/review`,
        {
          rating,
          comment,
          name: user.name,
          userId: user._id,
        }
      );
      toast.success("Review submitted!");
      const res2 = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${id}`);
      setAllReviews(res2.data.data.reviews || []);
    } catch (err) {
      toast.error("Error submitting review");
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) return toast.warn("Please login to delete review");

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL_PRO}/${product._id}/review/${reviewId}`
      );
      toast.success("Review deleted!");

      const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${id}`);
      setAllReviews(res.data.data.reviews || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  const handleNotifyMe = async () => {
    if (!notifyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // selectedSize is already guaranteed to be set because the "Notify Me" section
    // only appears when a size is out of stock and selected.

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/notify`, {
        productId: product._id,
        size: selectedSize,
        email: notifyEmail,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setNotifyEmail(user?.email || ""); // Reset to user's email or empty
      } else {
        toast.error(res.data.message || "Failed to submit notification request.");
      }
    } catch (error) {
      console.error("Error submitting notify request:", error);
      toast.error(error.response?.data?.message || "Server Error: Could not submit request.");
    }
  };

  return (
    <div className="px-6 py-8">
      <p className="text-sm text-gray-500 mb-4">
        Home / Product / {product.productName}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Images with Zoom Effect */}
        <div className="relative">
          <div
            className="relative overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <img
              ref={imgRef}
              src={selectedImage}
              alt="Product"
              className="w-full rounded shadow object-cover max-h-96 cursor-crosshair"
            />
            {showZoom && (
              <div
                ref={zoomRef}
                className="absolute hidden md:block w-32 h-32 rounded-full border-2 border-white bg-white shadow-lg pointer-events-none"
                style={{
                  left: `${zoomPosition.x}px`,
                  top: `${zoomPosition.y}px`,
                  backgroundImage: `url(${selectedImage})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: zoomBackgroundPos,
                  backgroundSize: `${imgRef.current?.offsetWidth * 2}px ${imgRef.current?.offsetHeight * 2}px`,
                  zIndex: 10,
                }}
              />
            )}
          </div>
          <div className="flex gap-2 mt-4">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                  selectedImage === img ? "border-purple-600" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            {[...Array(product.rate || 4)].map((_, i) => (
              <Star key={i} size={16} fill="gold" />
            ))}
            <span className="text-sm text-gray-500">{allReviews.length} Reviews</span>
          </div>

          <p className="text-2xl font-bold mb-4 text-purple-600">
            ₹{product.productPrice}
          </p>
          <p className="text-sm mb-4 text-gray-600">{product.description}</p>

          <div className="mb-4">
            <h4 className="font-semibold mb-1">Material</h4>
            <div className="flex gap-4">
              {["18k Gold", "22K Gold", "Rose Gold"].map((mat) => (
                <label key={mat} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="material"
                    checked={selectedMaterial === mat}
                    onChange={() => setSelectedMaterial(mat)}
                  />
                  {mat}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-1">Size</h4>
            <div className="flex gap-2">
              {product.sizes?.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSize(s.size)}
                  className={`px-3 py-1 border rounded ${
                    selectedSize === s.size ? "bg-purple-600 text-white" : ""
                  }`}
                >
                  {s.size} {s.quantity === 0 && "(Out of Stock)"}
                </button>
              ))}
            </div>
          </div>

          {/* Display current selected size's quantity */}
          <p className="text-sm text-gray-700 mb-2">
            {currentSizeQuantity > 0 ? `Only ${currentSizeQuantity} items left in stock for ${selectedSize}!` : `Size ${selectedSize} is Out of Stock!`}
          </p>

          {/* Conditional rendering for Add to Cart vs. Notify Me */}
          {!isSelectedSizeOutOfStock ? (
            <>
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Quantity</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="border px-2"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange('increase')} className="border px-2">
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  className={`px-6 py-2 text-white ${inCart ? "bg-red-500" : "bg-purple-600"} rounded`}
                  onClick={handleCartToggle}
                >
                  {inCart ? "Remove from Cart" : "Add to Cart"}
                </button>
                <button className="border px-6 py-2 rounded">Buy Now</button>
              </div>
            </>
          ) : (
            <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
              <p className="font-semibold text-red-600 mb-2">Size {selectedSize} is currently out of stock.</p>
              <p className="text-sm text-gray-700 mb-3">Enter your email and we'll notify you when it's back!</p>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring-purple-500 focus:border-purple-500"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
              />
              <button
                className="w-full px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={handleNotifyMe}
              >
                Notify Me When Available
              </button>
            </div>
          )}


          <ul className="text-sm mt-4 text-gray-600 list-disc pl-5">
            <li>Free shipping on orders over ₹499</li>
            <li>2-year warranty on all products</li>
            <li>30-day return policy</li>
          </ul>
        </div>
      </div>

      ---

      {/* Tabs */}
      <div className="mt-10">
        <div className="flex gap-6 border-b pb-2 mb-4 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize ${
                activeTab === tab
                  ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <p className="text-gray-700 text-sm">{product.description || "No description available."}</p>
        )}

        {activeTab === "specifications" && (
          <ul className="text-sm text-gray-700 list-disc pl-5">
            <li>Material: {selectedMaterial}</li>
            <li>Size: {selectedSize}</li>
            <li>Warranty: 2 years</li>
            <li>Return policy: 30 days</li>
          </ul>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4 text-sm text-gray-700">
            {user && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
              >
                Write a Review
              </button>
            )}

            <ReviewModal
              isOpen={isReviewModalOpen}
              onClose={() => setIsReviewModalOpen(false)}
              onSubmit={handleSubmitReview}
            />

            <h4 className="text-base font-semibold mt-6">Customer Reviews:</h4>
            {allReviews?.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              allReviews.map((r, i) => (
                <div key={i} className="border p-3 rounded mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex gap-1 text-yellow-500 mb-1">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="gold" />
                        ))}
                      </div>
                      <p className="text-sm italic">"{r.comment}"</p>
                      <p className="text-xs text-gray-500">– {r.name}</p>
                    </div>
                    {user && user._id === r.userId && (
                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      ---

      {/* Related Products Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Products</h2>
        {relatedProducts.length === 0 ? (
          <p className="text-gray-500">No related products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div key={p._id} className="border rounded p-4 shadow-sm">
                <img
                  src={p.images?.[0]}
                  alt={p.productName}
                  className="w-full h-40 object-cover mb-3 rounded"
                />
                <h4 className="font-semibold text-lg truncate">{p.productName}</h4>
                <p className="text-purple-600 font-bold mb-2">₹{p.productPrice}</p>
                <a
                  href={`/product/${p._id}`}
                  className="inline-block mt-2 px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;