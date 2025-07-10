import { ShoppingCart } from "lucide-react";
import Rings from "../assets/images/Rings.jpg";
import Container from "./Container";

const products = [
  {
    title: "Gold Infinity Ring",
    price: "$1,299.00",
    image: Rings, // Replace with your actual image
  },
  {
    title: "Gold Infinity Ring",
    price: "$1,299.00",
    image: Rings,
  },
  {
    title: "Gold Infinity Ring",
    price: "$1,299.00",
    image: Rings,
  },
  {
    title: "Gold Infinity Ring",
    price: "$1,299.00",
    image: Rings,
  },
];

const BestSeller = () => {
  return (
    <section className="bg-[#f1f6fd] py-16 px-4">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">Best Sellers</h2>
              <p className="text-gray-600  text-xs">
                Trending now! Shop our most-loved best sellers today.
              </p>
            </div>
            <button className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-md cursor-pointer shadow-sm overflow-hidden border border-purple-100 group relative transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <button className="absolute top-2 right-2 bg-white text-purple-600 cursor-pointer rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition duration-300">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </button>
                </div>

                <div className="p-4">
                  <button
                    className="w-full flex justify-center items-center gap-2 
             bg-purple-600 text-white text-sm py-2 mb-2 rounded-md font-medium 
             transform translate-y-4 opacity-0 
             group-hover:translate-y-0 group-hover:opacity-100 
             hover:bg-purple-700 hover:scale-[1.02] 
             transition-all duration-300 cursor-pointer"
                  >
                    <ShoppingCart size={16} />
                    ADD TO CART
                  </button>

                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-sm text-purple-600 font-semibold">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BestSeller;
