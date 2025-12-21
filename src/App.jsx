import React, { useState } from 'react';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ClientDashboard from './components/dashboards/ClientDashboard';

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

  // Mock branch data (would be fetched from backend in production)
  const mockBranches = {
    'branch_001': { id: 'branch_001', name: 'Main Branch', code: 'MAIN-001', logo: '' },
    'branch_002': { id: 'branch_002', name: 'Downtown Branch', code: 'DT-002', logo: '' }
  };

  // WARNING: Demo credentials for testing only - NEVER store credentials in frontend code in production
  // In production, use proper authentication with backend API and secure password handling
  const mockUsers = {
    'manager@imtiaz.com': { password: 'manager123', type: 'manager', id: 'mgr_001', name: 'John Manager', email: 'manager@imtiaz.com' },
    'admin@imtiaz.com': { password: 'admin123', type: 'admin', id: 'admin_001', name: 'Sarah Admin', email: 'admin@imtiaz.com', branchId: 'branch_001', branchName: 'Main Branch', branchCode: 'MAIN-001', referralCode: 'MAIN001-REF' },
    'client@example.com': { password: 'client123', type: 'client', id: 'client_001', name: 'John Smith', email: 'client@example.com', accountNumber: 'ACC-10001', branchId: 'branch_001', accountType: 'standard' },
    'business@example.com': { password: 'business123', type: 'client', id: 'client_002', name: 'Tech Corp', email: 'business@example.com', accountNumber: 'ACC-10002', branchId: 'branch_001', accountType: 'business' }
  };

  const branchReferralCodes = {
    'MAIN001-REF': { branchId: 'branch_001', branchName: 'Main Branch', branchCode: 'MAIN-001' },
    'DT002-REF': { branchId: 'branch_002', branchName: 'Downtown Branch', branchCode: 'DT-002' },
    'WEST003-REF': { branchId: 'branch_003', branchName: 'West Branch', branchCode: 'WEST-003' }
  };

  const handleLogin = () => {
    setLoginError('');
    const user = mockUsers[loginForm.email];
    if (!user) { setLoginError('User not found'); return; }
    if (user.password !== loginForm.password) { setLoginError('Invalid password'); return; }
    setCurrentUser(user);
  };

  const handleRegister = () => {
    if (registerForm.password !== registerForm.confirmPassword) { alert('Passwords do not match!'); return; }
    if (!registerForm.referralCode) { alert('Branch referral code is required!'); return; }
    const branchInfo = branchReferralCodes[registerForm.referralCode];
    if (!branchInfo) { alert('Invalid referral code!'); return; }
    
    alert(`✅ Account Created!\n\nName: ${registerForm.name}\nEmail: ${registerForm.email}\nAccount: ACC-${Math.floor(10000 + Math.random() * 90000)}\nBranch: ${branchInfo.branchName}`);
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', referralCode: '', phone: '' });
    setShowRegister(false);
  };

  if (currentUser) {
    const userBranch = currentUser.branchId ? mockBranches[currentUser.branchId] : null;
    switch (currentUser.type) {
      case 'manager': return <ManagerDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
      case 'admin': return <AdminDashboard user={currentUser} branch={userBranch} onLogout={() => setCurrentUser(null)} />;
      case 'client': return <ClientDashboard user={currentUser} branch={userBranch} onLogout={() => setCurrentUser(null)} />;
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
              <button onClick={handleRegister} className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold">Create Account</button>
              <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4 text-xs text-slate-300">
                <div className="font-semibold mb-1">Available Branch Codes:</div>
                <div><strong>MAIN001-REF</strong> - Main Branch</div>
                <div><strong>DT002-REF</strong> - Downtown Branch</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input type="email" placeholder="Email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
              <input type="password" placeholder="Password" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
              {loginError && <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-3 text-red-400 text-sm">{loginError}</div>}
              <button onClick={handleLogin} className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold">Login</button>
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 text-xs text-slate-300 space-y-1">
                <div><strong>Manager:</strong> manager@imtiaz.com / manager123</div>
                <div><strong>Admin:</strong> admin@imtiaz.com / admin123</div>
                <div><strong>Standard Client:</strong> client@example.com / client123</div>
                <div><strong>Business Client:</strong> business@example.com / business123</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImtiazTradingPlatform;
