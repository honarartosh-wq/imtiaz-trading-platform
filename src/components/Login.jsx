import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const quickLogin = (role) => {
    const credentials = {
      manager: { email: 'manager@imtiaz.com', password: 'manager123' },
      admin: { email: 'admin@imtiaz.com', password: 'admin123' },
      client: { email: 'client@example.com', password: 'client123' }
    };
    
    const cred = credentials[role];
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Imtiaz Trading Platform
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <p className="text-gray-400 text-sm text-center mb-3">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('manager')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 rounded transition-colors"
              >
                Manager
              </button>
              <button
                onClick={() => quickLogin('admin')}
                className="bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('client')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded transition-colors"
              >
                Client
              </button>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-xs text-center mt-4">
          © 2025 Imtiaz Trading Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
