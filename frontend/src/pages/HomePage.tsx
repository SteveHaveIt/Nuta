import React from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  const { data: products, isLoading, isError } = trpc.products.list.useQuery({ limit: 8 });

  if (isLoading) return <div className="text-center py-10">Loading products...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading products.</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white p-12 rounded-lg shadow-xl mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Nuta</h1>
        <p className="text-xl mb-6">Your one-stop shop for the best products online.</p>
        <Link to="/products" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg">
          Shop Now
        </Link>
      </section>

      {/* Featured Products Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/products" className="text-blue-600 hover:text-blue-800 font-semibold text-lg">
            View All Products &rarr;
          </Link>
        </div>
      </section>

      {/* Services Section (Placeholder) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Get your order in record time.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
          <p className="text-gray-600">100% safe and secure transactions.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
          <p className="text-gray-600">We are here to help you anytime.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
