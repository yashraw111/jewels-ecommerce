import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleCart, fetchCart } from "../redux/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState("");

  // ⭐ review
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [allReviews, setAllReviews] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.items);

  const sizes = ["XS", "S", "M", "L", "XL"];
  const tabs = ["description", "specifications", "reviews"];

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${id}`);
        const prod = res.data.data;
        setProduct(prod);
        setSelectedMaterial(prod.material || "18k Gold");
        setSelectedSize("M");
        setSelectedImage(prod.images?.[0] || "");
        setAllReviews(prod.reviews || []);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart(user._id));
    }
  }, [user, dispatch]);

  if (!product) return <div className="text-center py-10 text-lg">Loading...</div>;

  const inCart = cartItems.some(
    (item) =>
      item.productId._id === product._id &&
      item.material === selectedMaterial &&
      item.size === selectedSize
  );

  const handleCartToggle = () => {
    if (!user || !user._id) {
      toast.warning("Please login to add product to cart");
      return;
    }

    dispatch(
      toggleCart({
        userId: user._id,
        productId: product._id,
        material: selectedMaterial,
        size: selectedSize,
        quantity,
      })
    )
      .then(() => {
        toast.success(inCart ? "Removed from cart" : "Added to cart");
        dispatch(fetchCart(user._id));
      })
      .catch((err) => {
        toast.error("Failed to update cart");
        console.error(err);
      });
  };

  const handleSubmitReview = async () => {
    if (!user) return toast.warn("Please login to write a review");

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL_PRO}/${product._id}/review`,
        {
          rating,
          comment: reviewText,
          name: user.name,
          userId: user._id,
        }
      );
      toast.success("Review submitted!");
      setReviewText("");
      setRating(5);

      const res2 = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${id}`);
      setAllReviews(res2.data.data.reviews || []);
    } catch (err) {
      toast.error("Error submitting review");
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewUserId) => {
  if (!user || user._id !== reviewUserId) {
    return toast.warn("You can only delete your own review");
  }

  try {
    await axios.delete(`${import.meta.env.VITE_BASE_URL_PRO}/${product._id}/review/${user._id}`);
    toast.success("Review deleted!");
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${id}`);
    setAllReviews(res.data.data.reviews || []);
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete review");
  }
};


  return (
    <div className="px-6 py-8">
      <p className="text-sm text-gray-500 mb-4">
        Home / Product / {product.productName}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={selectedImage}
            alt="Product"
            className="w-full rounded shadow object-cover max-h-96"
          />
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
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-1 border rounded ${
                    selectedSize === s ? "bg-purple-600 text-white" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-1">Quantity</h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="border px-2"
              >
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="border px-2">
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              className={`px-6 py-2 text-white ${inCart ? "bg-red-500" : "bg-purple-600"}`}
              onClick={handleCartToggle}
            >
              {inCart ? "Remove from Cart" : "Add to Cart"}
            </button>
            <button className="border px-6 py-2">Buy Now</button>
          </div>

          <ul className="text-sm mt-4 text-gray-600 list-disc pl-5">
            <li>Free shipping on orders over ₹499</li>
            <li>2-year warranty on all products</li>
            <li>30-day return policy</li>
          </ul>
        </div>
      </div>

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

        {/* Description tab */}
        {activeTab === "description" && (
          <p className="text-gray-700 text-sm">
            {product.description || "No description available."}
          </p>
        )}

        {/* Specifications tab */}
        {activeTab === "specifications" && (
          <ul className="text-sm text-gray-700 list-disc pl-5">
            <li>Material: {selectedMaterial}</li>
            <li>Size: {selectedSize}</li>
            <li>Warranty: 2 years</li>
            <li>Return policy: 30 days</li>
          </ul>
        )}

        {/* Reviews tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="mb-4">
              <h4 className="text-base font-semibold mb-2">Write a Review</h4>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border px-2 py-1 mb-2"
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>
                    {star} Star{star > 1 && "s"}
                  </option>
                ))}
              </select>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                className="w-full border p-2 rounded mb-2"
              ></textarea>
              <button
                onClick={handleSubmitReview}
                className="bg-purple-600 text-white px-4 py-1 rounded"
              >
                Submit Review
              </button>
            </div>

            {/* Review List */}
            <h4 className="text-base font-semibold mt-6">Customer Reviews:</h4>
            {allReviews?.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
             allReviews?.map((r, i) => (
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
          onClick={() => handleDeleteReview(r.userId)}
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
    </div>
  );
};

export default ProductDetail;
