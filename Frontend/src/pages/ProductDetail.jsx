import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState("");  // added state for main image

  const tabs = ["description", "specifications", "reviews"];
  const sizes = ["XS", "S", "M", "L", "XL"];

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/${id}`);
        setProduct(res.data.data);
        setSelectedMaterial(res.data.data.material || "18k Gold");
        setSelectedSize(res.data.data.size || "M");
        setSelectedImage(res.data.data.images?.[0] || ""); // set first image initially
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="px-6 py-8">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-4">Home / Product / {product.productName}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Images */}
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
                onClick={() => setSelectedImage(img)}  // on thumbnail click change main image
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            {[...Array(product.rate || 4)].map((_, i) => (
              <Star key={i} size={16} fill="gold" />
            ))}
            <span className="text-sm text-gray-500">42 Reviews</span>
          </div>

          <p className="text-2xl font-bold mb-4 text-purple-600">₹{product.productPrice}</p>
          <p className="text-sm mb-4 text-gray-600">{product.description}</p>

          {/* Material */}
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

          {/* Size */}
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

          {/* Quantity */}
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Quantity</h4>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="border px-2">
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="border px-2">
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-purple-600 text-white px-6 py-2">Add to Cart</button>
            <button className="border px-6 py-2">Buy Now</button>
          </div>

          {/* Delivery Info */}
          <ul className="text-sm mt-4 text-gray-600 list-disc pl-5">
            <li>Free shipping on orders over ₹499</li>
            <li>2-year warranty on all products</li>
            <li>30-day return policy</li>
          </ul>
        </div>
      </div>

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
          <p className="text-gray-700 text-sm">
            {product.description || "No description available."}
          </p>
        )}
        {activeTab === "specifications" && (
          <ul className="text-sm text-gray-700 list-disc pl-5">
            <li>Material: {selectedMaterial}</li>
            <li>Size: {selectedSize}</li>
            <li>Warranty: 2 years</li>
            <li>Return policy: 30 days</li>
          </ul>
        )}
        {activeTab === "reviews" && <p className="text-sm text-gray-700">Customer reviews coming soon.</p>}
      </div>

      {/* Related Products Dummy */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">You May Also Like</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="border p-2 shadow-sm rounded text-center">
              <img src={product.images?.[0]} alt="Related Product" className="w-full h-32 object-cover mb-2" />
              <h4 className="text-sm font-semibold">{product.productName}</h4>
              <p className="text-purple-600 font-bold text-sm">₹{product.productPrice}</p>
              <button className="mt-2 text-xs bg-purple-600 text-white px-4 py-1">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
