import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">About Nuta</h1>
      
      <section className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          At Nuta, our mission is to provide high-quality products at competitive prices, delivered with exceptional customer service. We believe in creating a seamless and enjoyable shopping experience for everyone.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>**Quality:** We source only the best products for our customers.</li>
          <li>**Integrity:** We operate with transparency and honesty in all our dealings.</li>
          <li>**Customer Focus:** Our customers are at the heart of everything we do.</li>
          <li>**Innovation:** We constantly seek new ways to improve our platform and services.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Contact Us</h2>
        <p className="text-gray-700">
          Have questions or need support? Reach out to us at:
        </p>
        <p className="text-blue-600 font-medium mt-2">
          Email: support@nuta.com
        </p>
        <p className="text-blue-600 font-medium">
          Phone: +254 700 000 000
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
