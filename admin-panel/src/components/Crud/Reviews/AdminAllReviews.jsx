import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminAllReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL_PRO}/reviews/all`);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Failed to load reviews", error);
    }
  };
  console.log(reviews)

const deleteReview = async (productId, reviewId) => {
  const confirm = await Swal.fire({
    title: "Delete this review?",
    text: "It will be removed permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirm.isConfirmed) {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL_PRO}/${productId}/review/${reviewId}`);
      Swal.fire("Deleted!", "Review deleted.", "success");
      fetchReviews();
    } catch (error) {
      Swal.fire("Error!", "Failed to delete review.", "error");
    }
  }
};
console.log(reviews)


  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      <h1>📝 All Product Reviews (Admin Panel)</h1>
      {reviews.length === 0 ? (
        <p>Loading reviews...</p>
      ) : (
        <table className="table table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>
                <td>{r.productName}</td>
                <td>{r.name}</td>
                <td>{r.rating}</td>
                <td>{r.comment}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteReview(r.productId, r._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAllReviews;
