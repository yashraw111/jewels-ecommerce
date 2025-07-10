import React from "react";

const features = [
  {
    number: "1",
    title: "Premium Quality",
    description: "100% certified gold jewelry",
  },
  {
    number: "2",
    title: "Unique Designs",
    description: "Handcrafted by skilled artisans",
  },
  {
    number: "3",
    title: "Lifetime Warranty",
    description: "On all our jewelry pieces",
  },
  {
    number: "4",
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
              className="border border-purple-100 rounded-md p-6 bg-white text-center"
            >
              <div className="bg-purple-100 w-14 h-14 mx-auto rounded-full flex items-center justify-center text-purple-700 font-bold text-lg mb-4">
                {feature.number}
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