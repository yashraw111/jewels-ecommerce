import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Shipping Policy</h1>
      <p className="mb-4">
        At KUKU JEWELS, we ensure that your order reaches you safely and on time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Time</h2>
      <p>
        All orders are processed within 1-2 business days. Delivery takes 5-7 business days
        depending on your location. You’ll receive a tracking link via email once shipped.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Charges</h2>
      <p>
        We offer free shipping on all orders above ₹499. Orders below ₹499 will be charged a flat rate of ₹50.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">International Shipping</h2>
      <p>
        Currently, we only ship within India. Stay tuned as we expand our reach globally.
      </p>
    </div>
  );
};

export default ShippingPolicy;
