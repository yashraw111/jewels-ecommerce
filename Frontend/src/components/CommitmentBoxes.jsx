const features = [
  {
    id: 1,
    title: "Quality Materials",
    description:
      "We use only the finest 18K and 22K gold, ethically sourced gemstones, and diamonds in all our creations.",
  },
  {
    id: 2,
    title: "Master Craftsmanship",
    description:
      "Our skilled artisans combine traditional techniques with modern innovation to create jewelry of exceptional quality.",
  },
  {
    id: 3,
    title: "Ethical Practices",
    description:
      "We are committed to responsible sourcing and sustainable practices throughout our supply chain.",
  },
];

const CommitmentBoxes = () => (
  <div className="text-center my-10">
    <h3 className="text-xl font-bold mb-8">Our Commitment to Excellence</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature) => (
        <div
          key={feature.id}
          className="border border-purple-200 rounded p-6 shadow-sm "
        >
          <div className="bg-purple-100 text-purple-700 w-20 h-20 flex items-center justify-center rounded-full text-lg font-bold mb-4 mx-auto">
            {feature.id}
          </div>
          <h4 className="font-semibold mb-2">{feature.title}</h4>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default CommitmentBoxes;
