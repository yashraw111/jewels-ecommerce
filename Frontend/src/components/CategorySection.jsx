import { useEffect, useState, memo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";

// Skeleton Loader for a single category item
const CategorySkeleton = () => (
    <div className="w-40 sm:w-48 flex-shrink-0 mx-4 animate-pulse">
        <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-lg shadow-md"></div>
        <div className="h-4 bg-gray-200 rounded mt-3 w-3/4 mx-auto"></div>
    </div>
);

// Memoized Category Item to prevent unnecessary re-renders
const CategoryItem = memo(({ item, onClick }) => (
    <div
        onClick={() => onClick(item._id)}
        className="w-40 sm:w-48 flex-shrink-0 mx-4 cursor-pointer group"
    >
        <div className="overflow-hidden rounded-lg shadow-lg transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
            <img
                src={item.cat_image}
                alt={item.cat_name}
                className="w-full h-40 sm:h-48 object-cover"
                loading="lazy" // Lazy load images for better performance
            />
        </div>
        <p className="mt-3 font-semibold text-gray-800 text-center transition-colors group-hover:text-purple-600">
            {item.cat_name}
        </p>
    </div>
));

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_BASE_URL_CAT}`)
            .then((res) => {
                setCategories(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching categories:", err);
                setIsLoading(false);
            });
    }, []);

    const handleCategoryClick = (id) => {
        navigate(`/categoryPr/${id}`);
    };

    return (
        <section className="py-16 bg-gray-50 text-center overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Browse Our Collections</h2>
                <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                    From timeless classics to modern designs, discover the perfect piece for every occasion in our curated collections.
                </p>

                {isLoading ? (
                    <div className="flex justify-center">
                        {/* Display multiple skeleton loaders for a better initial impression */}
                        {[...Array(5)].map((_, i) => <CategorySkeleton key={i} />)}
                    </div>
                ) : (
                    <Marquee
                        pauseOnHover
                        gradient={true}
                        gradientColor={[249, 250, 251]} // Match with bg-gray-50
                        gradientWidth={50}
                        speed={30}
                    >
                        {categories.map((item) => (
                            <CategoryItem
                                key={item._id}
                                item={item}
                                onClick={handleCategoryClick}
                            />
                        ))}
                    </Marquee>
                )}
            </div>
        </section>
    );
};

export default CategorySection;
