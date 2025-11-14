import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, totalAmount } = useCart();

  const totalInKES = (totalAmount / 100).toFixed(2);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center min-h-[70vh]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-3/4 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/100x100?text=Product"
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-lg text-blue-600 font-medium">KES {(item.price / 100).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="w-16 p-2 border border-gray-300 rounded-md text-center"
                />
                <p className="text-lg font-semibold text-gray-800">KES {((item.price * item.quantity) / 100).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:w-1/4 bg-white p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
          <div className="flex justify-between text-lg font-medium mb-4">
            <span>Subtotal:</span>
            <span>KES {totalInKES}</span>
          </div>
          <div className="flex justify-between text-lg font-medium mb-6">
            <span>Shipping:</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-blue-600 border-t pt-4">
            <span>Order Total:</span>
            <span>KES {totalInKES}</span>
          </div>
          <Link to="/checkout" className="mt-6 w-full block text-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
