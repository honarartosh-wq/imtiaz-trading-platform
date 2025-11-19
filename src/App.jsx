import React, { useState } from 'react';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ClientDashboard from './components/dashboards/ClientDashboard';
import Input from './components/shared/Input';
import Button from './components/shared/Button';
import { useToast } from './context/ToastContext';
import { validateEmail, validatePassword, validatePasswordMatch, validateRequiredFields } from './utils/validation';
import { generateAccountNumber } from './utils/helpers';

// ==================== MAIN APP ====================
const ImtiazTradingPlatform = () => {
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    phone: '',
    accountType: 'standard'
  });
  const [showRegister, setShowRegister] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Mock branch data (would be fetched from backend in production)
  const mockBranches = {
    'branch_001': { id: 'branch_001', name: 'Main Branch', code: 'MAIN-001', logo: '' },
    'branch_002': { id: 'branch_002', name: 'Downtown Branch', code: 'DT-002', logo: '' }
  };

  // WARNING: Demo credentials for testing only - NEVER store credentials in frontend code in production
  // In production, use proper authentication with backend API and secure password handling
  const mockUsers = {
    'manager@imtiaz.com': {
      password: 'manager123',
      type: 'manager',
      id: 'mgr_001',
      name: 'John Manager',
      email: 'manager@imtiaz.com'
    },
    'admin@imtiaz.com': {
      password: 'admin123',
      type: 'admin',
      id: 'admin_001',
      name: 'Sarah Admin',
      email: 'admin@imtiaz.com',
      branchId: 'branch_001',
      branchName: 'Main Branch',
      branchCode: 'MAIN-001',
      referralCode: 'MAIN001-REF'
    },
    'client@example.com': {
      password: 'client123',
      type: 'client',
      id: 'client_001',
      name: 'John Smith',
      email: 'client@example.com',
      accountNumber: 'ACC-10001',
      branchId: 'branch_001',
      accountType: 'standard'
    },
    'business@example.com': {
      password: 'business123',
      type: 'client',
      id: 'client_002',
      name: 'Tech Corp',
      email: 'business@example.com',
      accountNumber: 'ACC-10002',
      branchId: 'branch_001',
      accountType: 'business'
    }
  };

  const branchReferralCodes = {
    'MAIN001-REF': { branchId: 'branch_001', branchName: 'Main Branch', branchCode: 'MAIN-001' },
    'DT002-REF': { branchId: 'branch_002', branchName: 'Downtown Branch', branchCode: 'DT-002' },
    'WEST003-REF': { branchId: 'branch_003', branchName: 'West Branch', branchCode: 'WEST-003' }
  };

  const handleLogin = () => {
    setLoginError('');
    const user = mockUsers[loginForm.email];
    if (!user) {
      setLoginError('User not found');
      return;
    }
    if (user.password !== loginForm.password) {
      setLoginError('Invalid password');
      return;
    }
    setCurrentUser(user);
  };

  const handleRegister = () => {
    // Validate required fields
    const requiredValidation = validateRequiredFields(registerForm, ['name', 'email', 'password', 'confirmPassword', 'referralCode']);
    if (!requiredValidation.isValid) {
      toast.error(requiredValidation.error);
      return;
    }

    // Validate email
    const emailValidation = validateEmail(registerForm.email);
    if (!emailValidation.isValid) {
      toast.error(emailValidation.error);
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(registerForm.password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.error);
      return;
    }

    // Validate passwords match
    const passwordMatchValidation = validatePasswordMatch(registerForm.password, registerForm.confirmPassword);
    if (!passwordMatchValidation.isValid) {
      toast.error(passwordMatchValidation.error);
      return;
    }

    // Validate referral code
    const branchInfo = branchReferralCodes[registerForm.referralCode];
    if (!branchInfo) {
      toast.error('Invalid referral code. Please check and try again.');
      return;
    }

    const accountNumber = generateAccountNumber();
    const accountTypeLabel = registerForm.accountType === 'standard' ? 'Standard Account' : 'Business Account';
    toast.success(`Account created successfully!\n\nAccount: ${accountNumber}\nType: ${accountTypeLabel}\nBranch: ${branchInfo.branchName}\n\nYou can now login with your credentials!`, 6000);
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', referralCode: '', phone: '', accountType: 'standard' });
    setShowRegister(false);
  };

  // If user is logged in, show appropriate dashboard
  if (currentUser) {
    const userBranch = currentUser.branchId ? mockBranches[currentUser.branchId] : null;
    switch (currentUser.type) {
      case 'manager':
        return <ManagerDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
      case 'admin':
        return <AdminDashboard user={currentUser} branch={userBranch} onLogout={() => setCurrentUser(null)} />;
      case 'client':
        return <ClientDashboard user={currentUser} branch={userBranch} onLogout={() => setCurrentUser(null)} />;
      default:
        return null;
    }
  }

  // Login/Register UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Imtiaz Trading
          </div>
          <p className="text-slate-400">Professional Trading Platform</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setShowRegister(false)}
              className={`flex-1 py-3 rounded-lg font-semibold ${!showRegister ? 'bg-emerald-600' : 'bg-slate-700 text-slate-400'}`}
            >
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className={`flex-1 py-3 rounded-lg font-semibold ${showRegister ? 'bg-emerald-600' : 'bg-slate-700 text-slate-400'}`}
            >
              Register
            </button>
          </div>

          {!showRegister ? (
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                error={loginError}
              />
              <Input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <Button
                onClick={handleLogin}
                className="w-full"
                variant="primary"
                size="lg"
              >
                Login
              </Button>
              {/* Demo Credentials */}
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-blue-400 mb-2">🎯 Demo Accounts - Try Now!</div>
                <div><strong>Manager:</strong> manager@imtiaz.com / manager123</div>
                <div><strong>Admin:</strong> admin@imtiaz.com / admin123</div>
                <div><strong>Standard Client:</strong> client@example.com / client123</div>
                <div><strong>Business Client:</strong> business@example.com / business123</div>
              </div>

              {/* Platform Features */}
              <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg p-4 text-xs text-slate-300">
                <div className="font-semibold text-emerald-400 mb-2">✨ Platform Features</div>
                <div className="space-y-1">
                  <div>• Real-time trading dashboard</div>
                  <div>• Multi-currency support (EURUSD, XAUUSD, BTCUSD)</div>
                  <div>• Wallet management & transfers</div>
                  <div>• Transaction history & analytics</div>
                  <div>• Standard & Business account types</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
              <Input
                type="tel"
                placeholder="Phone"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />

              {/* Account Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Account Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, accountType: 'standard' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      registerForm.accountType === 'standard'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-white mb-1">Standard</div>
                      <div className="text-xs text-slate-400">Personal Trading</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterForm({ ...registerForm, accountType: 'business' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      registerForm.accountType === 'business'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-white mb-1">Business</div>
                      <div className="text-xs text-slate-400">Corporate Trading</div>
                    </div>
                  </button>
                </div>
              </div>

              <Input
                type="text"
                placeholder="Branch Referral Code"
                className="uppercase"
                value={registerForm.referralCode}
                onChange={(e) => setRegisterForm({ ...registerForm, referralCode: e.target.value.toUpperCase() })}
              />
              <Input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              />
              <Button
                onClick={handleRegister}
                className="w-full"
                variant="primary"
                size="lg"
              >
                Create Account
              </Button>

              {/* Branch Referral Codes */}
              <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4 text-xs text-slate-300">
                <div className="font-semibold text-purple-400 mb-2">🏢 Available Branch Codes</div>
                <div className="space-y-1">
                  <div><strong>MAIN001-REF</strong> - Main Branch</div>
                  <div><strong>DT002-REF</strong> - Downtown Branch</div>
                  <div><strong>WEST003-REF</strong> - West Branch</div>
                </div>
              </div>

              {/* Account Type Benefits */}
              <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4 text-xs text-slate-300">
                <div className="font-semibold text-slate-300 mb-2">💡 Account Types</div>
                <div className="space-y-2">
                  <div>
                    <div className="font-semibold text-emerald-400">Standard Account:</div>
                    <div className="text-slate-400">Perfect for individual traders</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-400">Business Account:</div>
                    <div className="text-slate-400">Advanced features for corporate trading</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImtiazTradingPlatform;
