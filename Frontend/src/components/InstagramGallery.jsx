import React from "react";
import Rings from "../assets/images/Rings.jpg";
import Earrings from "../assets/images/Earrings.jpg";
import Necklaces from "../assets/images/necklaces.jpg";
import Bracelet from "../assets/images/Bracelet.jpg";
import Bangles from "../assets/images/bangles.jpg";
import Pendants from "../assets/images/pendants.jpg";
import { Instagram } from "lucide-react";

const images = [Rings, Earrings, Necklaces, Bracelet, Bangles, Pendants];

const InstagramGallery = () => {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-2xl font-bold mb-1">Follow Us on Instagram</h2>
      <p className="text-gray-600 mb-8">@kukujewels</p>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {images.map((img, i) => (
          <div key={i} className="relative w-36 h-36 overflow-hidden rounded-md group">
            <img
              src={img}
              alt="Instagram"
              className="object-cover w-full h-full"
            />
            <div className="absolute cursor-pointer inset-0 bg-black bg-opacity-30 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Instagram />
            </div>
          </div>
        ))}
      </div>

      <button className="bg-purple-600 cursor-pointer text-white px-6 py-2 text-sm font-semibold rounded hover:bg-purple-700 transition">
        View Instagram
      </button>
    </section>
  );
};

export default InstagramGallery;
