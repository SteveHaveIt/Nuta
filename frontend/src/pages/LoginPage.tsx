import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trpc } from '../utils/trpc';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Assuming the backend has a login mutation in the auth router
  // Since the backend only has 'me' and 'logout', we'll simulate a successful login for now
  // In a real scenario, this would be trpc.auth.login.useMutation()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- Placeholder for actual login logic ---
    // Since the backend only exposes me/logout, we'll simulate a successful login
    // In a real app, you would call a trpc.auth.login mutation here.
    if (email === 'admin@nuta.com' && password === 'password') {
      // Simulate fetching user data after successful login
      const simulatedUser = {
        id: 1,
        openId: 'simulated-admin-id',
        name: 'Admin User',
        email: 'admin@nuta.com',
        role: 'admin' as const,
      };
      login(simulatedUser);
      navigate('/account');
    } else if (email === 'user@nuta.com' && password === 'password') {
      const simulatedUser = {
        id: 2,
        openId: 'simulated-user-id',
        name: 'Test User',
        email: 'user@nuta.com',
        role: 'user' as const,
      };
      login(simulatedUser);
      navigate('/account');
    } else {
      setError('Invalid email or password. (Using simulated login)');
    }
    // --- End Placeholder ---
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Sign in to your account</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
