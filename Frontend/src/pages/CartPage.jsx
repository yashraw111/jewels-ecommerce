import React, { useState } from "react";
import productImg from "../assets/images/Bracelet.jpg";
import { Trash2 } from "lucide-react";
import Container from "../components/Container";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Gold Infinity Ring 1",
      price: 120,
      quantity: 1,
    },
    {
      id: 2,
      name: "Gold Infinity Ring 1",
      price: 120,
      quantity: 1,
    },
  ]);

  const updateQuantity = (id, action) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: action === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 20;
  const tax = 20;
  const total = subtotal + shipping + tax;

  return (
    <div className="px-6 py-10">
        <Container>

      <p className="text-sm text-gray-100 mb-4">Home / Cart Page</p>
      <h2 className="text-2xl font-bold mb-6">Cart Page</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="    text-left">
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
                  <tr key={item.id} className="border-t">
                  <td className="p-2">
                    <img src={productImg} alt="item" className="w-16 h-16 rounded" />
                  </td>
                  <td>{item.name}</td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => updateQuantity(item.id, "dec")}
                        className="border px-2"
                        >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, "inc")}
                        className="border px-2"
                        >
                        +
                      </button>
                    </div>
                  </td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="mt-4 border px-4 py-2">&larr; Continue Shopping</button>
        </div>

        {/* Summary */}
        <div className="border border-gray-100 p-6 shadow-sm">
          <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
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
          <button className="mt-4 w-full bg-purple-600 text-white py-2">Proceed to Checkout</button>
        </div>
      </div>
              </Container>
    </div>
  );
};

export default CartPage;
