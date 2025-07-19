import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Container from "../components/Container";
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

const TrackOrder = () => {
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false); // To manage loading state for actions
  
  const refetchOrders = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/orders/user/${user._id}`
      );
      const fetchedOrders = res.data.orders;
      setOrders(fetchedOrders);

      const delivered = fetchedOrders.filter(
        (order) => order.status === "Delivered"
      );
      const pending = fetchedOrders.filter(
        (order) => order.status !== "Delivered" && order.status !== "Cancelled" && order.status !== "Return Requested" // Exclude cancelled/returned from pending
      );
      setDeliveredOrders(delivered);

      setPendingOrders(pending);

    } catch (error) {
      console.error("Error refetching orders:", error);
      toast.error("Failed to refetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchOrders();
  }, [user]); // Depend on user, so it fetches when user logs in

  const stepMapping = {
    "Processing": 0,
    "Shipped": 1,
    "Out for delivery": 2,
    "Delivered": 3,
  };

  const renderStatus = (status) => {
    const steps = ["Ordered", "Shipping", "Out for delivery", "Delivered"];
    const currentIndex = stepMapping[status] ?? 0;

    return (
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-6">
        {steps.map((step, index) => (
          <div className="flex items-center w-full" key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index <= currentIndex ? "bg-purple-600" : "bg-gray-300 text-gray-600"
                }`}
              >
                {index <= currentIndex ? "✓" : ""}
              </div>
              <span className="text-sm mt-2 text-center">{step}</span>
            </div>

            {/* Connector line */}
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentIndex ? "bg-purple-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // --- New functions for Cancel and Return ---
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setLoading(true);
      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/orders/cancel/${orderId}`);
        toast.success("Order cancelled successfully!");
        refetchOrders(); // Re-fetch orders to update the UI
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error(error.response?.data?.message || "Failed to cancel order.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReturnOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to request a return for this order?")) {
      setLoading(true);
      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/orders/return/${orderId}`);
        toast.success("Return requested successfully!");
        refetchOrders(); // Re-fetch orders to update the UI
      } catch (error) {
        console.error("Error requesting return:", error);
        toast.error(error.response?.data?.message || "Failed to request return.");
      } finally {
        setLoading(false);
      }
    }
  };
  // --- End New functions ---


  // Helper function to render individual order details
  const renderOrderDetails = (order) => (
    <div key={order._id} className="border rounded p-6 mb-6 shadow-md bg-white">
      {/* Order Progress - Only for pending/active orders that are not cancelled/returned */}
      {order.status !== "Delivered" && order.status !== "Cancelled" && order.status !== "Return Requested" && renderStatus(order.status)}

      {/* Display current status clearly */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Order ID: {order._id}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold
          ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
            order.status === 'Return Requested' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'}
        `}>
          Status: {order.status}
        </span>
      </div>


      {/* Delivery & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
        <div>
          <h3 className="font-semibold">Delivery by Kuku Jewels</h3>
          <p>Tracking ID: {order.trackingId || "Not assigned yet"}</p>
          <p className="text-sm text-gray-500 mt-1">
            Ordered At: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Shipping Address</h3>
          <p>
            {order.shippingInfo?.address}, {order.shippingInfo?.city},{" "}
            {order.shippingInfo?.state}, {order.shippingInfo?.postalCode}
          </p>
          <p>Phone: {order.shippingInfo?.phone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {order.items.map((item, i) => (
          <div key={i} className="border p-2 rounded text-center bg-gray-50">
            <img
              src={
                item.productId?.images?.[0] ||
                "https://via.placeholder.com/100"
              }
              alt={item.productId?.productName || "Product"}
              className="w-full h-32 object-cover rounded"
            />
            <p className="mt-2 font-medium text-sm">
              {item.productId?.productName}
            </p>
            <p className="text-xs text-gray-600">Size: {item.size || "-"}</p>
            <p className="text-xs text-gray-600">
              Material: {item.material || "-"}
            </p>
            <p className="text-sm font-semibold text-purple-600">
              ₹{item.price} x {item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Total Price and Action Buttons */}
      <div className="flex justify-between items-center mt-4">
        <div className="font-bold text-lg">
          Total: ₹{order.totalPrice.toFixed(2)}
        </div>
        <div className="flex gap-2">
          {/* Cancel Button */}
          {order.status === "Processing" && (
            <button
              onClick={() => handleCancelOrder(order._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              disabled={loading} // Disable button while an action is in progress
            >
              {loading ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}

          {/* Return Button */}
          {order.status === "Delivered" && (
            <button
              onClick={() => handleReturnOrder(order._id)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Requesting Return...' : 'Request Return'}
            </button>
          )}
          {/* Show a disabled button or message if already cancelled/returned requested */}
          {order.status === "Cancelled" && (
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
              disabled
            >
              Cancelled
            </button>
          )}
          {order.status === "Return Requested" && (
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
              disabled
            >
              Return Requested
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Container>
      <h2 className="text-2xl font-bold my-6">📦 Track Your Current Orders</h2>

      {loading && <p className="text-center text-blue-500">Loading orders...</p>}
      {!loading && pendingOrders.length === 0 && deliveredOrders.length === 0 && (
        <p className="text-center py-10 text-lg text-gray-700">
          You haven't placed any orders yet.
        </p>
      )}

      {!loading && pendingOrders.length === 0 && deliveredOrders.length > 0 && (
        <p className="mb-8 text-gray-600">No active orders to track. All orders are delivered or past actions.</p>
      )}

      {!loading && pendingOrders.map((order) => renderOrderDetails(order))}

      {/* Separator for delivered orders */}
      {!loading && deliveredOrders.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-10 mb-6 border-t pt-8">✅ Successfully Delivered Orders</h2>
          {deliveredOrders.map((order) => renderOrderDetails(order))}
        </>
      )}

    </Container>
  );
};

export default TrackOrder;