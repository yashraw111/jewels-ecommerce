import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!feedback.trim() || rating === 0) {
      alert("Please add feedback and select a rating.");
      return;
    }
    onSubmit({ rating, comment: feedback });
    setRating(0);
    setFeedback("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-80 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-lg"
        >
          ✖
        </button>

        <h3 className="text-lg font-bold mb-4 text-center text-gray-800">
          Rate this Product
        </h3>

        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={currentRating}
                  className="hidden"
                  onClick={() => setRating(currentRating)}
                />
                <FaStar
                  size={28}
                  color={
                    currentRating <= (hover || rating)
                      ? "#a855f7"
                      : "#e4e5e9"
                  }
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer transition-colors"
                />
              </label>
            );
          })}
        </div>

        <textarea
          placeholder="Write your feedback..."
          className="w-full border border-gray-300 p-2 rounded mb-4 text-sm focus:outline-purple-400"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
        />

        <button
          onClick={handleSubmit}
          className="bg-purple-600 text-white font-medium px-4 py-2 rounded w-full hover:bg-purple-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
