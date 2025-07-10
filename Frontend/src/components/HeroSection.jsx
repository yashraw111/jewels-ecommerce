import React, { useEffect, useState } from "react";
import HeroImage1 from "../assets/images/woman-s-arm-wearing-jewelry.png.jpg";

const slides = [
  {
    image: HeroImage1,
    title: "Elegant Jewelry for Every Occasion",
    subtitle: "Discover the latest collection of handcrafted pieces",
  },
  {
    image: HeroImage1,
    title: "Shine Bright Like Never Before",
    subtitle: "Timeless designs made just for you",
  },
  {
    image: HeroImage1,
    title: "Luxury That Tells a Story",
    subtitle: "Jewelry that defines your personality",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 h-[80vh] relative">
            <img
              src={slide.image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-lg md:text-2xl mb-6 drop-shadow-md">
                {slide.subtitle}
              </p>
             <button
  className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-lg 
             transition-all duration-300 transform hover:scale-105 hover:bg-purple-600 
             hover:text-white hover:shadow-xl cursor-pointer"
>
  Shop Now
</button>

            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute cursor-pointer top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full hover:bg-opacity-70 z-20"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute cursor-pointer top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full hover:bg-opacity-70 z-20"
      >
        &#10095;
      </button>
    </div>
  );
};

export default HeroSection;
