import React from "react";
import { Gem, Palette, ShieldCheck, CreditCard } from "lucide-react"; // Icons

const features = [
  {
    icon: <Gem size={28} className="text-purple-600" />,
    title: "Premium Quality",
    description: "100% certified gold jewelry",
  },
  {
    icon: <Palette size={28} className="text-purple-600" />,
    title: "Unique Designs",
    description: "Handcrafted by skilled artisans",
  },
  {
    icon: <ShieldCheck size={28} className="text-purple-600" />,
    title: "Lifetime Warranty",
    description: "On all our jewelry pieces",
  },
  {
    icon: <CreditCard size={28} className="text-purple-600" />,
    title: "Secure Payments",
    description: "Multiple payment options",
  },
];
const ChooseUs = () => {
  return (
    <section className="bg-[#f1f6fd] py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Why Choose Kuku Jewels</h2>
        <p className="text-gray-600 mb-10">
          Unique designs, premium quality—discover the beauty of KUKU JEWELS.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 cursor-pointer">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-purple-100 rounded-md p-6 bg-white text-center hover:shadow-lg transition"
            >
              <div className="bg-purple-100 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseUs;
