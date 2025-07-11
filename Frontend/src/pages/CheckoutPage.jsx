import React, { useState } from "react";
import Container from "../components/Container";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { clearCart } from "../redux/cartSlice";

const CheckoutPage = () => {
  const user = useSelector((state) => state.user.user);
//   console.log(user)
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.productId.productPrice * item.quantity,
    0
  );
  const shipping = 20;
  const tax = 20;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
      return toast.error("Please fill all required fields");
    }

    try {
      const orderData = {
        userId: user._id,
        items: cartItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.productPrice,
        })),
        shippingInfo,
        totalPrice: total,
      };

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/orders`, orderData);

      if (res.data.success) {
        toast.success("Order placed successfully!");
        // dispatch(clearCart());
        navigate("/order-success");
      } else {
        toast.error("Failed to place order");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error("Server Error");
    }
  };

  return (
    <div className="py-10 px-6">
      <Container>
        <h2 className="text-2xl font-bold mb-6">🧾 Checkout</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Shipping Form */}
          <div className="md:col-span-2 border p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
            <form className="space-y-4">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={shippingInfo.state}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={shippingInfo.postalCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </form>
          </div>

          {/* Summary */}
          <div className="border p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;
