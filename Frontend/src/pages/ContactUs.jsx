import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Optional for notifications

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/contact`, formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
      <p className="text-sm text-gray-500 mb-8">Home / Contact Us</p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* ✅ FORM SECTION */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-gray-600 mb-4">
            Get in touch with our team for inquiries about our products and services.
          </p>
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border border-purple-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border border-purple-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className="w-full border border-purple-300 p-2 rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Send Message
          </button>
        </form>

        {/* ✅ INFO SECTION (unchanged) */}
        <div>
          <h3 className="font-semibold text-xl mb-4">Get in touch</h3>
          <div className="flex gap-4 mb-4">
            {[Phone, Mail, MapPin].map((Icon, i) => (
              <div
                key={i}
                className="bg-purple-600 text-white p-3 rounded-full hover:scale-105 transition"
              >
                <Icon size={20} />
              </div>
            ))}
          </div>
          <div>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58736.86860567364!2d72.46391971982845!3d23.05847121173898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9ca1402b2107%3A0xc6b7cfd374cb4bcb!2sThaltej%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1752053805236!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ borderRadius: "12px" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
