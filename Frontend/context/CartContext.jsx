import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const userId = "user123"; // 🔒 replace with actual user ID from auth

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL_CART}/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Cart fetch failed:", err);
    }
  };

  const toggleCart = async (productId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL_CART}/toggle`, {
        userId,
        productId,
      });
      console.log(res.data.message);
      fetchCart(); // update cart
    } catch (err) {
      console.error("Toggle cart error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};
