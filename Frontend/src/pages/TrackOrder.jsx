import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Container from "../components/Container";

const TrackOrder = () => {
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/orders/user/${user._id}`
        );
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  // Mapping statuses to index positions
  const stepMapping = {
    "Processing": 0,
    "Shipped": 1,
    "Out for delivery": 2,
    "Delivered": 3,
  };

  // Progress tracker UI
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

  return (
    <Container>
      <h2 className="text-2xl font-bold my-6">📦 Track Your Order</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="border rounded p-6 mb-6 shadow-md">
            {/* Order Progress */}
            {renderStatus(order.status)}

            {/* Delivery & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
              <div>
                <h3 className="font-semibold">Delivery by Kuku Jewels</h3>
                <p>Tracking ID: {order.trackingId || "Not assigned yet"}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Ordered At: {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
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
                <div key={i} className="border p-2 rounded text-center">
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

            {/* Total Price */}
            <div className="text-right mt-4 font-bold text-lg">
              Total: ₹{order.totalPrice.toFixed(2)}
            </div>
          </div>
        ))
      )}
    </Container>
  );
};

export default TrackOrder;
