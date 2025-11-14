import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number; // in cents
  imageUrl: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const priceInKES = (product.price / 100).toFixed(2);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
    }, 1);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition duration-300 hover:shadow-xl">
      <Link to={`/products/${product.id}`}>
        <img className="w-full h-48 object-cover" src={product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} alt={product.name} />
      </Link>
      <div className="p-4">
        <span className="text-sm text-gray-500">{product.category}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mt-1">{product.name}</h3>
        </Link>
        <p className="text-xl font-bold text-blue-600 mt-2">KES {priceInKES}</p>
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
