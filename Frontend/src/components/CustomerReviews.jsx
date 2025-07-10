import React from "react";
import customerImg from "../assets/images/customer.jpg"
import Container from "./Container";

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Loyal Customer",
    rating: 4,
    text: "The craftsmanship of my gold bracelet is exceptional. The attention to detail and the quality of the gold is exactly what I was looking for. Will definitely shop again!",
    image: customerImg,
  },
  {
    name: "Sarah Johnson",
    role: "Loyal Customer",
    rating: 4,
    text: "The craftsmanship of my gold bracelet is exceptional. The attention to detail and the quality of the gold is exactly what I was looking for. Will definitely shop again!",
    image: customerImg,
  },
  {
    name: "Sarah Johnson",
    role: "Loyal Customer",
    rating: 4,
    text: "The craftsmanship of my gold bracelet is exceptional. The attention to detail and the quality of the gold is exactly what I was looking for. Will definitely shop again!",
    image: customerImg,
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
        <Container>

      <h2 className="text-2xl font-bold mb-2">Customer Love</h2>
      <p className="text-gray-600 mb-10">
        Real reviews, happy customers! See what they love most.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
            <div
            key={index}
            className="border border-purple-100  p-6 shadow-sm cursor-pointer"
            >
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-yellow-400 ${i >= review.rating ? 'text-gray-300' : ''}`}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-700 italic mb-4">"{review.text}"</p>
            <div className="flex items-center gap-3">
              <img
                src={review.image}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover"
                />
              <div>
                <p className="font-semibold text-sm">{review.name}</p>
                <p className="text-xs text-gray-500">{review.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
        </Container>
    </section>
  );
};

export default CustomerReviews;