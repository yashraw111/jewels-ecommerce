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

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.productId.productPrice * item.quantity,
    0
  );

  // --- START DISCOUNT AND SHIPPING LOGIC (Replicated from CartPage) ---
  let discountAmount = 0;
  let calculatedShipping = 20; // Default shipping charge
  const tax = 20; // Fixed tax

  const discountThreshold = 50000; // ₹50,000 for 10% discount
  const freeShippingThreshold = 100000; // ₹100,000 for free delivery

  // Apply 10% discount if subtotal is 50,000 or more
  if (subtotal >= discountThreshold) {
    discountAmount = subtotal * 0.10; // 10% discount
  }

  // Apply Free Delivery if subtotal is 100,000 or more
  if (subtotal >= freeShippingThreshold) {
    calculatedShipping = 0; // Free delivery
  }
  // --- END DISCOUNT AND SHIPPING LOGIC ---

  // Calculate final total with discount and calculated shipping
  const total = subtotal - discountAmount + calculatedShipping + tax;

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

const handlePlaceOrder = async () => {
  if (cartItems.length === 0) {
    return toast.error("Your cart is empty. Please add products to proceed.");
  }

  if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
    return toast.error("Please fill all required fields");
  }

  try {
    // 1. Create Razorpay Order
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
        // 2. Verify Payment
        const verifyRes = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/payment/verify-payment`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
        );

        if (verifyRes.data.success) {
          // 3. Create Order in backend
          const orderData = {
            userId: user._id,
            items: cartItems.map((item) => ({
              productId: item.productId._id,
              productName: item.productId.productName,
              quantity: item.quantity,
              price: item.productId.productPrice,
              size: item.size || "", // ✅ Send selected size
              material: item.selectedMaterial || "", // optional
            })),
            shippingInfo,
            totalPrice: total,
            paymentInfo: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            },
          };

          await axios.post(`${import.meta.env.VITE_BASE_URL}/api/orders`, orderData);
          

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
    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Payment Failed. Please try again.");
    }
  }
};

console.log(cartItems)

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

            {/* Discount Display */}
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm mb-2 text-green-600 font-medium">
                <span>Discount (10%)</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span className={calculatedShipping === 0 ? "text-green-600 font-medium" : ""}>
                {calculatedShipping === 0 ? "FREE" : `₹${calculatedShipping.toFixed(2)}`}
              </span>
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