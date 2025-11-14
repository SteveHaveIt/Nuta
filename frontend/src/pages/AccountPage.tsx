import React from 'react';
import { useAuth } from '../context/AuthContext';
import { trpc } from '../utils/trpc';
import { Link, Navigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Fetch user's orders
  const { data: orders, isLoading: isOrdersLoading, isError: isOrdersError } = trpc.orders.myOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated and not loading
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Account</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* User Profile */}
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">Profile Information</h2>
          <p className="text-lg mb-2"><strong>Name:</strong> {user?.name || 'N/A'}</p>
          <p className="text-lg mb-2"><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p className="text-lg mb-2"><strong>Role:</strong> <span className="capitalize">{user?.role || 'user'}</span></p>
          <p className="text-lg mb-2"><strong>User ID:</strong> {user?.id}</p>
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
            Edit Profile
          </button>
        </div>

        {/* Order History */}
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold border-b pb-2 mb-4">Order History</h2>
          
          {isOrdersLoading && <p>Loading orders...</p>}
          {isOrdersError && <p className="text-red-500">Error loading order history.</p>}
          
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Order #{order.orderNumber}</p>
                    <span className={`px-3 py-1 text-sm rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600">Total: KES {(order.totalAmount / 100).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline text-sm mt-2 block">View Details</Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have not placed any orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
