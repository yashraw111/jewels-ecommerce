import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import HeroImage1 from "../assets/images/woman-s-arm-wearing-jewelry.png.jpg"

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
]

const HeroSection = () => {
  return (
    <div className="relative w-full h-[92vh] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[92vh]">
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
                <button className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-purple-600 hover:text-white transition-all duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 👉 Custom Swiper Arrows (Override Default Styles) */}
      <style>
        {`
          .swiper-button-prev,
          .swiper-button-next {
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            width: 48px;
            height: 48px;
            border-radius: 9999px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 50;
            transition: background 0.3s ease;
          }

          .swiper-button-prev:hover,
          .swiper-button-next:hover {
            background: #9333ea; /* Purple */
          }

          .swiper-button-prev::after,
          .swiper-button-next::after {
            font-size: 18px;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  )
}

export default HeroSection
