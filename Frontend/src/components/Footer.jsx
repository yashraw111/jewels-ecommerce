import { Facebook, Instagram, Twitter } from "lucide-react";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-[#a344e1] text-white pt-12">
      <Container>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-sm mb-4">
            Stay updated with our latest collections, exclusive offers, and
            jewelry care tips
          </p>
          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-l-md w-72 text-black bg-gray-100 border-black"
            />
            <button className="bg-white cursor-pointer text-[#a344e1] px-4 py-2 rounded-r-md font-semibold">
              Subscribe
            </button>
          </div>
        </div>

        <hr className="border-white opacity-30 mb-8" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Logo & Description */}
          <div>
            <h3 className="text-3xl font-serif mb-2 tracking-wide">
              KUKU <span className="font-normal">JEWELS</span>
            </h3>
            <p className="mb-4">
              Crafting timeless gold jewelry pieces that celebrate life's
              precious moments.
            </p>
            <div className="flex space-x-4 items-center">
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center  bg-white text-[#a344e1] rounded-full shadow hover:bg-gray-100 transition"
              >
                <Twitter />
              </a>
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center bg-white text-[#a344e1] rounded-full shadow hover:bg-gray-100 transition"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center bg-white text-[#a344e1] rounded-full shadow hover:bg-gray-100 transition"
              >
                <Instagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-1">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">All Product</a>
              </li>
              <li>
                <a href="#">Categories</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-3">Customer Service</h4>
            <ul className="space-y-1">
              <li className="">
                <a href="#">Track Order</a>
              </li>
              <li>
                <a href="#">Return & Exchange</a>
              </li>
              <li>
                <a href="#">Shipping Policy</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <p>
              123 Jewelry Lane, Gold District
              <br />
              New York, NY 10001
            </p>
            <p className="mt-2">Email: info@kukujewels.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>

        <div className="text-center text-sm mt-8 py-4 border-t border-white/30">
          © 2025 KUKU JEWELS. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
