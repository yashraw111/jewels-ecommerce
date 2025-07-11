import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Container from "../components/Container";

const CategoryProducts = () => {
  const { id } = useParams(); // category id from URL
  const [products, setProducts] = useState([]);
  const navigate =useNavigate()
  const handleAddToCart = (productId) => {
    // Optional: Add to cart logic here if needed
    navigate(`/product/${productId}`);
  };
  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 scroll to top

    axios
      .get(`${import.meta.env.VITE_BASE_URL_PRO}/cat?category=${id}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching category products:", err));
  }, [id]);

  console.log(products);
  return (
    <div className="py-10">
      <Container>
        <h2 className="text-2xl font-bold mb-6">Category Products</h2>
        {products?.length === 0 ? (
          <p>No products found for this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded hover:shadow transition"
              >
                <img
                 onClick={() => handleAddToCart(product._id)}
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-40 object-cover rounded cursor-pointer"
                />
                <h4 className="mt-2 font-semibold">{product.productName}</h4>
                <p className="text-gray-500 text-sm">₹{product.productPrice}</p>

                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="mt-2 cursor-pointer px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default CategoryProducts;
