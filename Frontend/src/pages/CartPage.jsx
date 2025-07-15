import React, { useEffect } from "react";
import { Trash2 } from "lucide-react";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, deleteCartItem } from "../redux/cartSlice";
import productImg from "../assets/images/Bracelet.jpg";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // 👈 Add this import
import { ClipboardList } from "lucide-react"; // already used earlier


const CartPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.items);
const navigate = useNavigate(); // 👈 Add this inside the component


  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart(user._id));
    }
  }, [user, dispatch]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.productId.productPrice * item.quantity,
    0
  );
  const shipping = 20;
  const tax = 20;
  const total = subtotal + shipping + tax;

  return (
    <div className="px-6 py-10">
      <Container>
        <p className="text-sm text-gray-600 mb-4">Home / Cart Page</p>
        <h2 className="text-2xl font-bold mb-6">Cart Page</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Table */}
          {/* Cart Table */}
<div className="md:col-span-2">
  {cartItems.length === 0 ? (
    <div className="text-center py-20 text-gray-500">
      🛒 Your cart is empty.
      <div className="mt-4">
        <NavLink to="/products">
          <button className="border px-4 py-2 mt-2 cursor-pointer bg-purple-600 text-white">
            Shop Now
          </button>
        </NavLink>
      </div>
    </div>
  ) : (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left">
          <th className="p-2">Product</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {cartItems.map((item) => (
          <tr key={item._id} className="border-t">
            <td className="p-2">
              <img
                src={item.productId.images?.[0] || productImg}
                alt="item"
                className="w-16 h-16 rounded"
              />
            </td>
            <td>{item.productId.productName}</td>
            <td>{item.quantity}</td>
            <td>₹{item.productId.productPrice.toFixed(2)}</td>
            <td>
              ₹{(item.productId.productPrice * item.quantity).toFixed(2)}
            </td>
            <td>
              <button
                onClick={() =>
                  dispatch(
                    deleteCartItem({
                      cartItemId: item._id,
                      userId: user._id,
                    })
                  )
                }
                className="text-red-500 cursor-pointer hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


          {/* Summary */}
        {/* Summary */}
{cartItems.length > 0 && (
  <div className="border border-gray-100 p-6 shadow-sm">
    <h4 className="text-lg font-semibold mb-4">Order Summary</h4>

    {/* Subtotal, Shipping, Tax */}
    <div className="flex justify-between text-sm mb-2">
      <span>Subtotal</span>
      <span>₹{subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-sm mb-2">
      <span>Shipping</span>
      <span>₹{shipping.toFixed(2)}</span>
    </div>
    <div className="flex justify-between text-sm mb-2">
      <span>Tax</span>
      <span>₹{tax.toFixed(2)}</span>
    </div>
    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
      <span>Total</span>
      <span>₹{total.toFixed(2)}</span>
    </div>

    {/* Proceed to Checkout */}
    <button
      onClick={() => navigate("/checkout")}
      className="mt-4 w-full bg-purple-600 text-white py-2"
    >
      Proceed to Checkout
    </button>

    {/* 🔥 Order History Button */}
    <button
      onClick={() => navigate("/order-success")}
      className="mt-3 w-full flex items-center justify-center gap-2 border border-purple-600 text-purple-600 py-2 hover:bg-purple-50 transition"
    > 
      <ClipboardList size={18} />
      Order History
    </button>
  </div>
)}


        </div>
      </Container>
    </div>
  );
};

export default CartPage;
