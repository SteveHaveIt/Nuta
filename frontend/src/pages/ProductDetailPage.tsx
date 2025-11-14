import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { useCart } from '../context/CartContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : undefined;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const { data: product, isLoading, isError } = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: productId !== undefined }
  );

  if (isLoading || productId === undefined) return <div className="text-center py-10">Loading product details...</div>;
  if (isError || !product) return <div className="text-center py-10 text-red-500">Product not found.</div>;

  const priceInKES = (product.price / 100).toFixed(2);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
    }, quantity);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-wrap -mx-4">
        {/* Product Image */}
        <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
          <img
            className="w-full h-auto object-cover rounded-lg shadow-xl"
            src={product.imageUrl || 'https://via.placeholder.com/600x600?text=Product+Image'}
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-xl text-gray-500 mb-4">{product.category}</p>
          <p className="text-4xl font-extrabold text-blue-600 mb-6">KES {priceInKES}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description || 'No description provided.'}</p>
          </div>

          <div className="flex items-center mb-6">
            <span className="text-lg font-semibold mr-4">Quantity:</span>
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-20 p-2 border border-gray-300 rounded-md text-center"
            />
            <span className="ml-4 text-sm text-gray-500">({product.quantity} in stock)</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            className={`w-full py-3 px-6 rounded-lg text-white font-bold transition duration-300 ${
              product.quantity > 0
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews Section (Placeholder) */}
      <section className="mt-16 border-t pt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        <div className="text-gray-500">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
