import Rings from "../assets/images/Rings.jpg";
import Earrings from "../assets/images/Earrings.jpg";
import necklaces from "../assets/images/necklaces.jpg";
import Bracelet from "../assets/images/Bracelet.jpg";
import bangles from "../assets/images/bangles.jpg";
import pendants from "../assets/images/pendants.jpg";

const fallbackImage = Rings;

const categories = [
  { name: "Rings", image: Rings },
  { name: "Earring", image: Earrings },
  { name: "Necklaces", image: necklaces },
  { name: "Bracelets", image: Bracelet },
  { name: "Bangles", image: bangles },
  { name: "Pendants", image: pendants },
  { name: "Chains", image: fallbackImage },
  { name: "Anklets", image: fallbackImage },
];

const Category = () => {
  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-2">Browse Categories</h2>
      <p className="text-sm text-gray-500 mb-6">Home / Category</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="group relative h-48 cursor-pointer bg-gray-100 rounded overflow-hidden shadow"
          >
            {/* Zooming image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0  bg-opacity-50 flex items-center justify-center flex-col text-white">
              <h3 className="text-lg font-semibold">{cat.name}</h3>
              <p className="text-sm">42 Product</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
