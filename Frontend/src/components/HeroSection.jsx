import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import axios from "axios"

const HeroSection = () => {
  const [slides, setSlides] = useState([])

  useEffect(() => {
    async function fetchHeroBanners() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/banners`)
        setSlides(res.data)
      } catch (err) {
        console.error("Error loading hero banners:", err)
      }
    }

    fetchHeroBanners()
  }, [])

  if (slides.length === 0) return null

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
        {slides?.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[92vh]">
              <img
                src={slide.banner_image}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl mb-6 drop-shadow-md">
                  {slide.subtitle || "Explore now"}
                </p>
                <button className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-purple-600 hover:text-white transition-all duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Arrow Styling */}
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
            background: #9333ea;
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
