import React, { useState } from 'react';
import { trpc } from '../utils/trpc';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  const { data: products, isLoading, isError } = trpc.products.list.useQuery();

  const filteredProducts = products?.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === '' || product.category === category;
    return matchesQuery && matchesCategory;
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    // 'newest' is the default sort from the backend, so no client-side sort needed
    return 0;
  });

  const categories = Array.from(new Set(products?.map(p => p.category).filter(Boolean) || []));

  if (isLoading) return <div className="text-center py-10">Loading products...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading products.</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">All Products</h1>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md flex-grow"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No products found matching your criteria.</div>
      )}
    </div>
  );
};

export default ProductsPage;
