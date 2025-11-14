import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { trpc } from '../utils/trpc';

const CheckoutPage: React.FC = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal'>('mpesa');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const createOrderMutation = trpc.orders.create.useMutation();

  const totalInKES = (totalAmount / 100).toFixed(2);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center min-h-[70vh]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Please add items to your cart before checking out.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
        deliveryAddress,
        paymentMethod,
        guestPhone: isAuthenticated ? undefined : guestPhone,
        guestEmail: isAuthenticated ? undefined : guestEmail,
      };

      const result = await createOrderMutation.mutateAsync(orderData);

      // Clear cart and navigate to a success page
      clearCart();
      navigate(`/order-success?orderNumber=${result.orderNumber}&pin=${result.orderPin}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* Delivery and Payment Details */}
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">Delivery Information</h2>
          
          {!isAuthenticated && (
            <>
              <div>
                <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700">Email (for order updates)</label>
                <input
                  id="guestEmail"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700">Phone Number (for order tracking)</label>
                <input
                  id="guestPhone"
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Delivery Address</label>
            <textarea
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <h2 className="text-2xl font-bold border-b pb-2 mb-4 pt-4">Payment Method</h2>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="mpesa"
                checked={paymentMethod === 'mpesa'}
                onChange={() => setPaymentMethod('mpesa')}
                className="form-radio text-blue-600"
              />
              <span>M-Pesa</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
                className="form-radio text-blue-600"
              />
              <span>PayPal</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-gray-600 text-sm mb-1">
              <span>{item.name} (x{item.quantity})</span>
              <span>KES {((item.price * item.quantity) / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-lg font-medium">
              <span>Subtotal:</span>
              <span>KES {totalInKES}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-blue-600 pt-2">
              <span>Total:</span>
              <span>KES {totalInKES}</span>
            </div>
          </div>
          
          {error && <p className="text-red-500 mt-4">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !deliveryAddress}
            className={`mt-6 w-full py-3 px-4 rounded-lg text-white font-bold transition duration-300 ${
              isSubmitting || !deliveryAddress ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
