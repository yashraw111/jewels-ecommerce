import React from 'react';

const FAQs = () => {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions (FAQs)</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">1. How can I track my order?</h2>
        <p>
          After placing your order, you’ll receive a tracking number via email. You can also track it from the “Track Order” page.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">2. What is your return policy?</h2>
        <p>
          We offer a 30-day hassle-free return on all unused items in original packaging. Please refer to our Return Policy.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">3. Do you offer custom jewelry?</h2>
        <p>
          Currently, we do not offer customizations. However, we are working to provide personalized jewelry soon.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">4. Is my payment secure?</h2>
        <p>
          Yes, all payments are processed securely using industry-standard encryption.
        </p>
      </div>
    </div>
  );
};

export default FAQs;
