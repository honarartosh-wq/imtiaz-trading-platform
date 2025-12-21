import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';
import { register as registerAPI } from '../services/api';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    accountType: 'standard' // 'standard' or 'business'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!registerForm.referralCode) {
      setError('Branch referral code is required');
      return;
    }

    try {
      setLoading(true);

      // Call the API register function
      const response = await registerAPI({
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
        referralCode: registerForm.referralCode,
        accountType: registerForm.accountType
      });

      setSuccess('Account created successfully! You can now login with your credentials.');

      // Reset form
      setRegisterForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
        accountType: 'standard'
      });

      // Switch to login mode after 2 seconds
      setTimeout(() => {
        setIsRegisterMode(false);
        setEmail(registerForm.email); // Pre-fill email for convenience
        setSuccess('');
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.detail ||
                          err.response?.data?.message ||
                          'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className={`p-3 rounded-full ${isRegisterMode ? 'bg-green-600' : 'bg-blue-600'}`}>
              {isRegisterMode ? <UserPlus className="w-8 h-8 text-white" /> : <LogIn className="w-8 h-8 text-white" />}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Imtiaz Trading Platform
          </h2>
          <p className="text-gray-400 text-center mb-6">
            {isRegisterMode ? 'Create your account' : 'Sign in to your account'}
          </p>

          {/* Toggle between Login and Register */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                !isRegisterMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                isRegisterMode
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {!isRegisterMode && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
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

              {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </form>
          )}

          {/* Registration Form */}
          {isRegisterMode && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Enter your phone number (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Branch Referral Code *
                </label>
                <input
                  type="text"
                  value={registerForm.referralCode}
                  onChange={(e) => setRegisterForm({ ...registerForm, referralCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 uppercase"
                  placeholder="Enter branch referral code"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Contact your branch for the referral code
                </p>
              </div>

              {/* Account Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, accountType: 'standard' })}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      registerForm.accountType === 'standard'
                        ? 'bg-blue-600 text-white border-2 border-blue-400'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600 border-2 border-gray-600'
                    }`}
                  >
                    <div className="text-sm">Standard</div>
                    <div className="text-xs opacity-75 mt-1">Individual Account</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, accountType: 'business' })}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      registerForm.accountType === 'business'
                        ? 'bg-purple-600 text-white border-2 border-purple-400'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600 border-2 border-gray-600'
                    }`}
                  >
                    <div className="text-sm">Business</div>
                    <div className="text-xs opacity-75 mt-1">Corporate Account</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Quick Login (Demo) - Only show in login mode */}
          {!isRegisterMode && (
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
          )}
        </div>

        <p className="text-gray-500 text-xs text-center mt-4">
          © 2025 Imtiaz Trading Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
