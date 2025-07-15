import { useEffect, useState } from "react";
import axios from "axios";
import Container from "./Container";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL_CAT}`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <section className="py-16 bg-white text-center">
      <Container>
        <h2 className="text-3xl font-bold mb-2">Browse Categories</h2>
        <p className="text-gray-600 mb-10">
          Discover our exquisite collection by category
        </p>

        {categories.length > 0 ? (
          <div className="custom-marquee-wrapper">
            <Marquee
              pauseOnHover
              gradient={false}
              speed={40} // Slightly increased speed
              className="gap-6"
            >
              {categories.map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/categoryPr/${item._id}`)}
                  className="w-40 mx-3 cursor-pointer hover:scale-105 transition-transform "
                >
                  <img
                    src={item.cat_image}
                    alt={item.cat_name}
                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                  />
                  <p className="mt-2 font-medium">{item.cat_name}</p>
                </div>
              ))}
            </Marquee>
          </div>
        ) : (
          <p>Loading categories...</p>
        )}
      </Container>
    </section>
  );
};

export default CategorySection;
