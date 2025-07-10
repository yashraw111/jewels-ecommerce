import React from "react";
import OfferImage from "../assets/images/offer-banner.jpg";
import Container from "./Container";

const OfferBanner = () => {
  return (
    <section className="py-16">
        <Container>


      <div className="max-w-7xl mx-auto px-4">
        <div
          className="rounded-3xl bg-cover bg-center text-white p-10 lg:p-20 lg:py-33"
          style={{
              backgroundImage: `url(${OfferImage})`,
            }}
            >
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Festive Season Special Offer
            </h2>
            <p className="mb-6 text-sm md:text-base">
              Enjoy up to 20% off on selected gold jewelry pieces
            </p>
            <button className="bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-100 transition">
              SHOP THE COLLECTION
            </button>
          </div>
        </div>
      </div>
            </Container>
    </section>
  );
};

export default OfferBanner;
