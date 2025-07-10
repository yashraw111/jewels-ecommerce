import Bracelet from "../assets/images/Bracelet.jpg";

const OurStory = () => (
  <div className="md:flex gap-10 items-center mb-12">
    <img src={Bracelet} alt="Story" className="w-full md:w-1/2 rounded shadow" />
    <div className="mt-6 md:mt-0 md:w-1/2">
      <h3 className="text-xl font-bold mb-3">Our Story</h3>
      <p className="text-gray-700 mb-2">
        Founded in 2010, KUKU JEWELS began as a small family-owned business with a passion
        for crafting exquisite gold jewelry. What started as a modest workshop has now grown
        into a renowned brand synonymous with quality, craftsmanship, and timeless elegance.
      </p>
      <p className="text-gray-700">
        Our founder, Amelia Kuku, believed that jewelry should not only be beautiful but also
        tell a story. This philosophy continues to guide our design process, ensuring that each
        piece we create carries meaning and emotion.
      </p>
    </div>
  </div>
);

export default OurStory;
