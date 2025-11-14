import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const pin = searchParams.get('pin');

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50">
      <div className="text-center p-10 bg-white shadow-xl rounded-lg max-w-lg">
        <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase. Your order has been confirmed.</p>
        
        {orderNumber && (
          <p className="text-xl font-semibold text-blue-600 mb-2">Order Number: {orderNumber}</p>
        )}
        {pin && (
          <p className="text-lg text-gray-700 mb-6">Guest Tracking PIN: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{pin}</span></p>
        )}

        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="inline-block px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Continue Shopping
          </Link>
          {orderNumber && (
            <Link
              to={`/orders/${orderNumber}`}
              className="inline-block px-6 py-3 text-lg font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-300"
            >
              Track Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
