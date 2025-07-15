import React, { useState } from "react";
import Container from "../components/Container";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice"; // 👈 import clearCart

const CheckoutPage = () => {
  const user = useSelector((state) => state.user.user);
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
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/create-order`, {
        totalPrice: total,
      });

      const { order } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Your Brand",
        description: "E-Commerce Payment",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/payment/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verifyRes.data.success) {
            const orderData = {
              userId: user._id,
              items: cartItems.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.productPrice,
                size: item.selectedSize,
                material: item.selectedMaterial,
              })),
              shippingInfo,
              totalPrice: total,
              paymentInfo: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              },
            };

            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/orders`, orderData);

            // ✅ Clear cart after successful order
            dispatch(clearCart(user._id));

            toast.success("Order placed successfully!");
            navigate("/order-success");
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: "#8B5CF6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error("Payment Failed");
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
              <input type="text" name="address" placeholder="Address" value={shippingInfo.address} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input type="text" name="city" placeholder="City" value={shippingInfo.city} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input type="text" name="state" placeholder="State" value={shippingInfo.state} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input type="text" name="postalCode" placeholder="Postal Code" value={shippingInfo.postalCode} onChange={handleInputChange} className="w-full p-2 border rounded" />
              <input type="text" name="phone" placeholder="Phone Number" value={shippingInfo.phone} onChange={handleInputChange} className="w-full p-2 border rounded" />
            </form>
          </div>

          {/* Order Summary */}
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
              type="button"
              onClick={handlePlaceOrder}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Place Order & Pay
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;
