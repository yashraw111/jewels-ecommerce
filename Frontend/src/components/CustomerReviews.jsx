import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "./Container";

const DEFAULT_PROFILE_IMG = "https://cdn.dribbble.com/users/5534/screenshots/14230133/profile_4x.jpg";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/product/reviews/customer?rating=5`
      );
      // Limit to first 5 reviews
      setReviews(res.data.reviews.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch customer reviews:", err);
    }
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <Container>
        <h2 className="text-2xl font-bold mb-2">Customer Love</h2>
        <p className="text-gray-600 mb-10">
          Real reviews, happy customers! See what they love most.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.length === 0 ? (
            <p>No customer reviews yet.</p>
          ) : (
            reviews.map((review, index) => (
              <div
                key={index}
                className="border border-purple-100 p-6 shadow-sm cursor-pointer"
              >
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-yellow-400 ${
                        i >= review.rating ? "text-gray-300" : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-700 italic mb-2">
                  "{review.comment}"
                </p>

                <p className="text-xs text-purple-600 mb-4">
                  Product: {review.productName}
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={review.image || DEFAULT_PROFILE_IMG}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-gray-500">
                      {review.role || "Happy Customer"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Container>
    </section>
  );
};

export default CustomerReviews;
