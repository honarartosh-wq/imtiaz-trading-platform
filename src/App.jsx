import React, { useState } from 'react';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ClientDashboard from './components/dashboards/ClientDashboard';
import { login, register, validateReferralCode, getErrorMessage } from './services/api';

// ==================== MAIN APP ====================
const ImtiazTradingPlatform = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    referralCode: '', 
    phone: '', 
    accountMode: 'demo',  // 'demo' or 'real'
    accountType: 'individual'  // 'individual' or 'business'
  });
  const [showRegister, setShowRegister] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle user login through backend API
  const handleLogin = async () => {
    setLoginError('');
    setIsLoading(true);
    
    try {
      const response = await login(loginForm.email, loginForm.password);
      
      // Store tokens in localStorage (Note: Use httpOnly cookies in production for better security)
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      // Transform backend role to frontend type format
      const userData = {
        ...response.user,
        type: response.user.role.toLowerCase()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
    } catch (error) {
      // Show generic error message for security
      setLoginError('Invalid email or password. Please try again.');
      console.error('Login error:', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration through backend API
  const handleRegister = async () => {
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!registerForm.referralCode) {
      alert('Branch referral code is required!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Validate referral code first
      await validateReferralCode(registerForm.referralCode);
      
      // Register user through backend API
      const response = await register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        referralCode: registerForm.referralCode,
        accountType: registerForm.accountType === 'business' ? 'business' : 'standard'
      });
      
      alert(`✅ Account Created Successfully!\n\nPlease login with your credentials to access your account.`);
      
      // Reset form and switch to login
      setRegisterForm({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        referralCode: '', 
        phone: '', 
        accountMode: 'demo',
        accountType: 'individual'
      });
      setShowRegister(false);
    } catch (error) {
      alert(`Registration failed: ${getErrorMessage(error)}`);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  if (currentUser) {
    switch (currentUser.type) {
      case 'manager': return <ManagerDashboard user={currentUser} onLogout={handleLogout} />;
      case 'admin': return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
      case 'client': return <ClientDashboard user={currentUser} onLogout={handleLogout} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">Imtiaz Trading</div>
          <p className="text-slate-400">Professional Trading Platform</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="flex space-x-2 mb-6">
            <button onClick={() => setShowRegister(false)} className={`flex-1 py-3 rounded-lg font-semibold ${showRegister ? 'bg-slate-700 text-slate-400' : 'bg-emerald-600'}`}>Login</button>
            <button onClick={() => setShowRegister(true)} className={`flex-1 py-3 rounded-lg font-semibold ${showRegister ? 'bg-emerald-600' : 'bg-slate-700 text-slate-400'}`}>Register</button>
          </div>

          {showRegister ? (
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
              <input type="email" placeholder="Email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
              <input type="tel" placeholder="Phone" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
              <input type="text" placeholder="Branch Referral Code" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white uppercase" value={registerForm.referralCode} onChange={(e) => setRegisterForm({ ...registerForm, referralCode: e.target.value.toUpperCase() })} />

              {/* Account Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, accountMode: 'demo' })}
                    className={`py-3 rounded-lg font-semibold transition-all ${registerForm.accountMode === 'demo' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                  >
                    <div className="text-sm">Demo Account</div>
                    <div className="text-xs opacity-75">Practice Trading</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, accountMode: 'real' })}
                    className={`py-3 rounded-lg font-semibold transition-all ${registerForm.accountMode === 'real' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                  >
                    <div className="text-sm">Real Account</div>
                    <div className="text-xs opacity-75">Live Trading</div>
                  </button>
                </div>
              </div>

              {/* Account Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, accountType: 'individual' })}
                    className={`py-3 rounded-lg font-semibold transition-all ${registerForm.accountType === 'individual' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                  >
                    <div className="text-sm">Individual</div>
                    <div className="text-xs opacity-75">Personal Trading</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, accountType: 'business' })}
                    className={`py-3 rounded-lg font-semibold transition-all ${registerForm.accountType === 'business' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                  >
                    <div className="text-sm">Business</div>
                    <div className="text-xs opacity-75">Corporate Account</div>
                  </button>
                </div>
              </div>

              <input type="password" placeholder="Password" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
              <input type="password" placeholder="Confirm Password" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} />
              <button onClick={handleRegister} disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
              <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4 text-xs text-slate-300">
                <div className="font-semibold mb-1">Branch Referral Code Required</div>
                <div>Contact your branch administrator for a valid referral code</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input type="email" placeholder="Email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
              <input type="password" placeholder="Password" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
              {loginError && <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-3 text-red-400 text-sm">{loginError}</div>}
              <button onClick={handleLogin} disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 text-xs text-slate-300 space-y-1">
                <div className="font-semibold">Backend authentication required</div>
                <div>Please ensure the backend server is running and accessible</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImtiazTradingPlatform;
