import React, { useState } from 'react';
import { TrendingUp, Copy, CheckCircle, DollarSign, Activity, BarChart3, Clock, Download, Upload, Eye, EyeOff, Plus, X, AlertTriangle, Server, Globe, FileText, Key } from 'lucide-react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from './services/api';

// ==================== CONSTANTS ====================
const TRADING_SYMBOLS = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'];

const DEFAULT_EXTRA_SPREAD = {
  EURUSD: 0.5,
  GBPUSD: 0.5,
  USDJPY: 0.5,
  XAUUSD: 2,
  BTCUSD: 10
};

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

  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Handle login with backend API
  const handleLogin = async () => {
    setLoginError('');
    setIsLoading(true);
    
    try {
      const response = await apiLogin(loginForm.email, loginForm.password);
      
      // Store tokens
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      // Get user data
      const userData = response.user || await getCurrentUser();
      setCurrentUser(userData);
      
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      setLoginError(errorMsg);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration with backend API
  const handleRegister = async () => {
    setRegisterError('');
    
    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match!');
      return;
    }
    
    // Validate referral code is provided
    if (!registerForm.referralCode) {
      setRegisterError('Branch referral code is required!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone || null,
        referralCode: registerForm.referralCode,
        accountType: registerForm.accountType === 'individual' ? 'standard' : 'business'
      };
      
      await apiRegister(userData);
      
      // Show success message
      alert(`✅ Account Created Successfully!\n\nName: ${registerForm.name}\nEmail: ${registerForm.email}\n\nYou can now login with your credentials.`);
      
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
      const errorMsg = error.response?.data?.detail || 'Registration failed. Please try again.';
      setRegisterError(errorMsg);
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
    const userBranch = currentUser.branch_id ? { id: currentUser.branch_id } : null;
    switch (currentUser.role) {
      case 'manager': return <ManagerDashboard user={currentUser} onLogout={handleLogout} />;
      case 'admin': return <AdminDashboard user={currentUser} branch={userBranch} onLogout={handleLogout} />;
      case 'client': return <ClientDashboard user={currentUser} branch={userBranch} onLogout={handleLogout} />;
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
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" 
                value={loginForm.email} 
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                disabled={isLoading}
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" 
                value={loginForm.password} 
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
              />
              {loginError && <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-3 text-red-400 text-sm">{loginError}</div>}
              <button 
                onClick={handleLogin} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed py-3 rounded-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-4 text-xs text-slate-300">
                <div className="font-semibold mb-2">🔐 Demo Accounts Available</div>
                <div className="text-slate-400">Contact your branch admin for demo credentials or register for a new account.</div>
                <div className="mt-2 text-slate-500">Note: All authentication is secured via backend API with JWT tokens.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== MANAGER DASHBOARD ====================
const ManagerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [branches, setBranches] = useState([
    { id: 1, name: 'Main Branch', code: 'MAIN-001', status: 'active', clients: 156, balance: 2450000, leverage: 100, commissionPerLot: 5.0, admin: { name: 'Sarah Admin', email: 'admin@imtiaz.com', password: 'admin123', status: 'active' }, transactions: [
      { id: 1, date: '2025-11-15 10:30:00', type: 'deposit', amount: 500000, balance: 2000000, description: 'Initial capital deposit', performedBy: 'System' },
      { id: 2, date: '2025-11-16 14:20:00', type: 'commission', amount: 2450, balance: 2002450, description: 'Client trading commissions', performedBy: 'Auto' },
      { id: 3, date: '2025-11-17 09:15:00', type: 'deposit', amount: 300000, balance: 2302450, description: 'Additional funding', performedBy: 'Manager' },
      { id: 4, date: '2025-11-18 16:45:00', type: 'withdrawal', amount: 150000, balance: 2152450, description: 'Branch operational expenses', performedBy: 'Manager' }
    ] },
    { id: 2, name: 'Downtown Branch', code: 'DT-002', status: 'active', clients: 98, balance: 1890000, leverage: 500, commissionPerLot: 3.5, admin: { name: 'Mike Smith', email: 'mike@imtiaz.com', password: 'admin456', status: 'active' }, transactions: [
      { id: 1, date: '2025-11-14 11:00:00', type: 'deposit', amount: 800000, balance: 800000, description: 'Branch opening capital', performedBy: 'System' },
      { id: 2, date: '2025-11-16 13:30:00', type: 'commission', amount: 1890, balance: 801890, description: 'Trading commissions collected', performedBy: 'Auto' },
      { id: 3, date: '2025-11-17 10:00:00', type: 'deposit', amount: 500000, balance: 1301890, description: 'Client deposits', performedBy: 'Admin' }
    ] }
  ]);
  const [lps, setLps] = useState([
    { id: 1, name: 'MetalsPro', type: 'MT5', status: 'connected', latency: 120, spread: 1.2, extraSpread: { EURUSD: 0.5, GBPUSD: 0.7, USDJPY: 0.6, XAUUSD: 2.0, BTCUSD: 10.0 }, uptime: 99.8, server: 'metals.mt5.com', login: 'mt5_123' },
    { id: 2, name: 'FXGlobal', type: 'FIX', status: 'connected', latency: 80, spread: 0.8, extraSpread: { EURUSD: 0.3, GBPUSD: 0.5, USDJPY: 0.4, XAUUSD: 1.5, BTCUSD: 8.0 }, uptime: 99.9, server: 'fix.fxglobal.com', login: 'fx_456' }
  ]);
  const [routingRules, setRoutingRules] = useState([
    { id: 1, symbol: 'EURUSD', side: 'BUY', lpId: 1, lpName: 'MetalsPro' },
    { id: 2, symbol: 'XAUUSD', side: 'SELL', lpId: 2, lpName: 'FXGlobal' }
  ]);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [showAddLP, setShowAddLP] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddRoutingRule, setShowAddRoutingRule] = useState(false);
  const [showEmergencyTrade, setShowEmergencyTrade] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [dateFilterFrom, setDateFilterFrom] = useState('');
  const [dateFilterTo, setDateFilterTo] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [showPasswords, setShowPasswords] = useState({});
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newBranch, setNewBranch] = useState({ name: '', code: '', address: '', phone: '', leverage: '100', commissionPerLot: '5.0', logo: '', adminName: '', adminEmail: '', adminPassword: '' });
  const [newLP, setNewLP] = useState({ 
    name: '', 
    type: 'REST+WebSocket',  // Default to hybrid setup
    apiKey: '', 
    apiSecret: '', 
    passphrase: '',
    baseUrl: '', 
    websocketUrl: '',
    login: '',  // For MT4/MT5
    password: '',  // For MT4/MT5
    server: '',  // For MT4/MT5
    spread: '', 
    uptime: '99.9', 
    extraSpread: { EURUSD: '0.5', GBPUSD: '0.5', USDJPY: '0.5', XAUUSD: '2.0', BTCUSD: '10.0' } 
  });
  const [newRoutingRule, setNewRoutingRule] = useState({ symbol: 'EURUSD', side: 'BUY', lpId: '' });
  const [emergencyTradeForm, setEmergencyTradeForm] = useState({ clientAccount: '', symbol: 'EURUSD', type: 'BUY', lots: '0.1', reason: '' });
  
  // Manager Wallet states
  const [managerWallet, setManagerWallet] = useState(250000);
  const [showManagerDepositModal, setShowManagerDepositModal] = useState(false);
  const [showManagerWithdrawModal, setShowManagerWithdrawModal] = useState(false);
  const [showBranchTransferModal, setShowBranchTransferModal] = useState(false);
  const [managerDepositAmount, setManagerDepositAmount] = useState('');
  const [managerWithdrawAmount, setManagerWithdrawAmount] = useState('');
  const [branchTransferAmount, setBranchTransferAmount] = useState('');
  const [selectedBranchForTransfer, setSelectedBranchForTransfer] = useState('');
  const [managerWalletTransactions, setManagerWalletTransactions] = useState([
    { id: 1, date: '2024-11-15 10:00', type: 'deposit', amount: 150000, description: 'Initial wallet funding', status: 'completed' },
    { id: 2, date: '2024-11-17 14:30', type: 'transfer', amount: 50000, description: 'Transfer to Main Branch', status: 'completed' },
    { id: 3, date: '2024-11-18 09:15', type: 'deposit', amount: 150000, description: 'Capital injection', status: 'completed' }
  ]);
  const [marketPrices, setMarketPrices] = useState({
    EURUSD: { bid: 1.09485, ask: 1.09495, spread: 1.0 },
    GBPUSD: { bid: 1.26475, ask: 1.26488, spread: 1.3 },
    USDJPY: { bid: 149.825, ask: 149.845, spread: 2.0 },
    XAUUSD: { bid: 2658.20, ask: 2658.80, spread: 6.0 },
    BTCUSD: { bid: 91250.00, ask: 91280.00, spread: 30.0 }
  });

  // Simulate live price updates for emergency trade modal
  React.useEffect(() => {
    if (!showEmergencyTrade) return;
    const interval = setInterval(() => {
      setMarketPrices(prev => {
        const updated = {};
        for (const symbol of Object.keys(prev)) {
          const change = (Math.random() - 0.5) * 0.0002;
          const newBid = prev[symbol].bid + change;
          const newAsk = newBid + (prev[symbol].spread / 10000);
          const decimals = symbol === 'XAUUSD' || symbol === 'BTCUSD' ? 2 : 5;
          updated[symbol] = {
            bid: Number.parseFloat(newBid.toFixed(decimals)),
            ask: Number.parseFloat(newAsk.toFixed(decimals)),
            spread: prev[symbol].spread
          };
        }
        return updated;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [showEmergencyTrade]);

  // Manager Wallet functions
  const handleManagerWalletDeposit = () => {
    const amount = Number.parseFloat(managerDepositAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    setManagerWallet(managerWallet + amount);
    setManagerWalletTransactions([{ id: Date.now(), date: new Date().toLocaleString(), type: 'deposit', amount, description: 'Manager wallet deposit', status: 'completed' }, ...managerWalletTransactions]);
    setManagerDepositAmount('');
    setShowManagerDepositModal(false);
    alert(`✅ Deposited $${amount.toLocaleString()} to manager wallet`);
  };

  const handleManagerWalletWithdraw = () => {
    const amount = Number.parseFloat(managerWithdrawAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    if (amount > managerWallet) { alert('Insufficient wallet balance'); return; }
    setManagerWallet(managerWallet - amount);
    setManagerWalletTransactions([{ id: Date.now(), date: new Date().toLocaleString(), type: 'withdrawal', amount, description: 'Manager wallet withdrawal', status: 'completed' }, ...managerWalletTransactions]);
    setManagerWithdrawAmount('');
    setShowManagerWithdrawModal(false);
    alert(`✅ Withdrew $${amount.toLocaleString()} from manager wallet`);
  };

  const handleTransferToBranch = () => {
    const amount = Number.parseFloat(branchTransferAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    if (amount > managerWallet) { alert('Insufficient wallet balance'); return; }
    if (!selectedBranchForTransfer) { alert('Please select a branch'); return; }
    
    const branch = branches.find(b => b.id === Number.parseInt(selectedBranchForTransfer, 10));
    if (!branch) { alert('Branch not found'); return; }
    
    setManagerWallet(managerWallet - amount);
    setBranches(branches.map(b => b.id === branch.id ? {...b, balance: b.balance + amount, transactions: [{ id: Date.now(), date: new Date().toLocaleString(), type: 'deposit', amount, balance: b.balance + amount, description: `Manager wallet transfer`, performedBy: 'Manager' }, ...b.transactions]} : b));
    setManagerWalletTransactions([{ id: Date.now(), date: new Date().toLocaleString(), type: 'transfer', amount, description: `Transfer to ${branch.name}`, status: 'completed' }, ...managerWalletTransactions]);
    
    setBranchTransferAmount('');
    setSelectedBranchForTransfer('');
    setShowBranchTransferModal(false);
    alert(`✅ Transferred $${amount.toLocaleString()} to ${branch.name}`);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        alert('Logo file size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBranch({...newBranch, logo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBranch = () => {
    if (!newBranch.name || !newBranch.code) { alert('Please fill required fields'); return; }
    const leverage = Number.parseInt(newBranch.leverage, 10) || 100;
    if (leverage < 1 || leverage > 1000) { alert('Leverage must be between 1:1 and 1:1000'); return; }
    const commissionPerLot = Number.parseFloat(newBranch.commissionPerLot) || 5;
    if (commissionPerLot < 0 || commissionPerLot > 100) { alert('Commission must be between 0 and 100'); return; }
    const admin = newBranch.adminName ? { name: newBranch.adminName, email: newBranch.adminEmail, password: newBranch.adminPassword, status: 'active' } : null;
    setBranches([...branches, { id: Date.now(), name: newBranch.name, code: newBranch.code, address: newBranch.address, phone: newBranch.phone, status: 'active', clients: 0, balance: 0, leverage: leverage, commissionPerLot: commissionPerLot, logo: newBranch.logo, admin, transactions: [] }]);
    setNewBranch({ name: '', code: '', address: '', phone: '', leverage: '100', commissionPerLot: '5.0', logo: '', adminName: '', adminEmail: '', adminPassword: '' });
    setShowAddBranch(false);
    alert(`✅ Branch added successfully with 1:${leverage} leverage and $${commissionPerLot} commission per lot!`);
  };

  const handleFreezeAdmin = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    if (!branch?.admin) return;
    
    const newStatus = branch.admin.status === 'active' ? 'frozen' : 'active';
    setBranches(branches.map(b => 
      b.id === branchId && b.admin 
        ? {...b, admin: {...b.admin, status: newStatus}} 
        : b
    ));
    alert(`✅ Admin ${newStatus === 'frozen' ? 'frozen' : 'activated'} successfully!`);
  };

  const handleOpenEditAdmin = (branch) => {
    setSelectedBranch(branch);
    setSelectedAdmin(branch.admin);
    setNewAdminPassword('');
    setShowEditAdminModal(true);
  };

  const handleUpdateAdminPassword = () => {
    if (!newAdminPassword || newAdminPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setBranches(branches.map(b => 
      b.id === selectedBranch.id && b.admin
        ? {...b, admin: {...b.admin, password: newAdminPassword}}
        : b
    ));
    setNewAdminPassword('');
    setShowEditAdminModal(false);
    alert('✅ Admin password updated successfully!');
  };

  const handleAddLP = () => {
    // Validate LP name
    if (!newLP.name || newLP.name.trim() === '') {
      alert('Please enter LP name');
      return;
    }

    // Type-specific validation
    if (newLP.type === 'MT5' || newLP.type === 'MT4') {
      // MetaTrader validation
      if (!newLP.login || !newLP.password || !newLP.server) {
        alert('Please fill all MetaTrader credentials (Login, Password, Server)');
        return;
      }
    } else if (newLP.type === 'REST+WebSocket') {
      // REST + WebSocket validation
      if (!newLP.apiKey || !newLP.apiSecret || !newLP.baseUrl || !newLP.websocketUrl) {
        alert('Please fill all REST+WebSocket credentials (API Key, API Secret, REST URL, WebSocket URL)');
        return;
      }
    } else if (newLP.type === 'REST') {
      // REST only validation
      if (!newLP.apiKey || !newLP.apiSecret || !newLP.baseUrl) {
        alert('Please fill all REST API credentials (API Key, API Secret, Base URL)');
        return;
      }
    } else if (newLP.type === 'WebSocket') {
      // WebSocket only validation
      if (!newLP.apiKey || !newLP.apiSecret || !newLP.websocketUrl) {
        alert('Please fill all WebSocket credentials (API Key, API Secret, WebSocket URL)');
        return;
      }
    } else if (newLP.type === 'FIX') {
      // FIX API validation
      if (!newLP.apiKey || !newLP.apiSecret || !newLP.passphrase || !newLP.baseUrl) {
        alert('Please fill all FIX API credentials (SenderCompID, TargetCompID, Password, Server)');
        return;
      }
    }

    const extraSpread = {
      EURUSD: Number.parseFloat(newLP.extraSpread.EURUSD) || 0.5,
      GBPUSD: Number.parseFloat(newLP.extraSpread.GBPUSD) || 0.5,
      USDJPY: Number.parseFloat(newLP.extraSpread.USDJPY) || 0.5,
      XAUUSD: Number.parseFloat(newLP.extraSpread.XAUUSD) || 2,
      BTCUSD: Number.parseFloat(newLP.extraSpread.BTCUSD) || 10
    };
    setLps([...lps, { id: Date.now(), ...newLP, extraSpread: extraSpread, status: 'connected', latency: Math.floor(Math.random() * 100) + 50, uptime: parseFloat(newLP.uptime) || 99.9 }]);

    // Reset form to initial state (REST+WebSocket as default)
    setNewLP({
      name: '',
      type: 'REST+WebSocket',
      apiKey: '',
      apiSecret: '',
      passphrase: '',
      baseUrl: '',
      websocketUrl: '',
      login: '',
      password: '',
      server: '',
      spread: '',
      uptime: '99.9',
      extraSpread: { EURUSD: '0.5', GBPUSD: '0.5', USDJPY: '0.5', XAUUSD: '2.0', BTCUSD: '10.0' }
    });
    setShowAddLP(false);
    alert('✅ Liquidity Provider added successfully with extra spread markup!');
  };

  const handleAddRoutingRule = () => {
    if (!newRoutingRule.lpId) { alert('Please select an LP'); return; }
    const lp = lps.find(l => l.id === Number.parseInt(newRoutingRule.lpId, 10));
    setRoutingRules([...routingRules, { id: Date.now(), ...newRoutingRule, lpId: Number.parseInt(newRoutingRule.lpId, 10), lpName: lp.name }]);
    setNewRoutingRule({ symbol: 'EURUSD', side: 'BUY', lpId: '' });
    setShowAddRoutingRule(false);
    alert('✅ Routing rule added!');
  };

  const handleDeleteRoutingRule = (id) => {
    if (window.confirm('Delete this routing rule?')) {
      setRoutingRules(routingRules.filter(r => r.id !== id));
      alert('✅ Routing rule deleted');
    }
  };

  const handleEmergencyTrade = () => {
    if (!emergencyTradeForm.clientAccount || !emergencyTradeForm.reason) { alert('Please fill all fields'); return; }
    alert(`✅ Emergency ${emergencyTradeForm.type} trade executed for ${emergencyTradeForm.clientAccount}\nSymbol: ${emergencyTradeForm.symbol}\nLots: ${emergencyTradeForm.lots}\nReason: ${emergencyTradeForm.reason}`);
    setEmergencyTradeForm({ clientAccount: '', symbol: 'EURUSD', type: 'BUY', lots: '0.1', reason: '' });
    setShowEmergencyTrade(false);
  };

  const togglePasswordVisibility = (branchId) => {
    setShowPasswords({...showPasswords, [branchId]: !showPasswords[branchId]});
  };

  const handleDeleteBranch = (id) => {
    if (window.confirm('Delete this branch?')) {
      setBranches(branches.filter(b => b.id !== id));
      alert('✅ Branch deleted');
    }
  };

  const handleDeleteLP = (id) => {
    if (window.confirm('Delete this LP?')) {
      setLps(lps.filter(lp => lp.id !== id));
      alert('✅ LP deleted');
    }
  };

  const handleDeposit = () => {
    const amount = Number.parseFloat(transactionAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    const newBalance = selectedBranch.balance + amount;
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'deposit',
      amount: amount,
      balance: newBalance,
      description: 'Manager deposit',
      performedBy: 'Manager'
    };
    setBranches(branches.map(b => 
      b.id === selectedBranch.id 
        ? {...b, balance: newBalance, transactions: [...(b.transactions || []), transaction]} 
        : b
    ));
    setTransactionAmount('');
    setShowDepositModal(false);
    setSelectedBranch(null);
    alert(`✅ Deposited $${amount.toLocaleString()} to ${selectedBranch.name}`);
  };

  const handleWithdraw = () => {
    const amount = Number.parseFloat(transactionAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    if (amount > selectedBranch.balance) { alert('Insufficient branch balance'); return; }
    const newBalance = selectedBranch.balance - amount;
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'withdrawal',
      amount: amount,
      balance: newBalance,
      description: 'Manager withdrawal',
      performedBy: 'Manager'
    };
    setBranches(branches.map(b => 
      b.id === selectedBranch.id 
        ? {...b, balance: newBalance, transactions: [...(b.transactions || []), transaction]} 
        : b
    ));
    setTransactionAmount('');
    setShowWithdrawModal(false);
    setSelectedBranch(null);
    alert(`✅ Withdrawn $${amount.toLocaleString()} from ${selectedBranch.name}`);
  };

  const openDepositModal = (branch) => {
    setSelectedBranch(branch);
    setShowDepositModal(true);
  };

  const openWithdrawModal = (branch) => {
    setSelectedBranch(branch);
    setShowWithdrawModal(true);
  };

  const openTransactionHistory = (branch) => {
    setSelectedBranch(branch);
    setDateFilterFrom('');
    setDateFilterTo('');
    setShowTransactionHistory(true);
  };

  const getFilteredTransactions = () => {
    if (!selectedBranch) return [];
    let transactions = selectedBranch.transactions || [];
    
    if (dateFilterFrom || dateFilterTo) {
      transactions = transactions.filter(t => {
        const transDate = new Date(t.date);
        const fromDate = dateFilterFrom ? new Date(dateFilterFrom + ' 00:00:00') : null;
        const toDate = dateFilterTo ? new Date(dateFilterTo + ' 23:59:59') : null;
        
        if (fromDate && toDate) {
          return transDate >= fromDate && transDate <= toDate;
        } else if (fromDate) {
          return transDate >= fromDate;
        } else if (toDate) {
          return transDate <= toDate;
        }
        return true;
      });
    }
    
    return transactions;
  };

  const exportTransactionsToPDF = (branch) => {
    let transactions = branch.transactions || [];
    
    // Filter by date range if specified
    if (dateFilterFrom || dateFilterTo) {
      transactions = transactions.filter(t => {
        const transDate = new Date(t.date);
        const fromDate = dateFilterFrom ? new Date(dateFilterFrom + ' 00:00:00') : null;
        const toDate = dateFilterTo ? new Date(dateFilterTo + ' 23:59:59') : null;
        
        if (fromDate && toDate) {
          return transDate >= fromDate && transDate <= toDate;
        } else if (fromDate) {
          return transDate >= fromDate;
        } else if (toDate) {
          return transDate <= toDate;
        }
        return true;
      });
    }
    
    const dateRangeText = dateFilterFrom || dateFilterTo 
      ? `Date Range: ${dateFilterFrom || 'Start'} to ${dateFilterTo || 'End'}`
      : 'Date Range: All Time';
    
    const content = `
IMTIAZ TRADING PLATFORM
Transaction History Report

Branch: ${branch.name}
Branch Code: ${branch.code}
Report Date: ${new Date().toLocaleString()}
${dateRangeText}
Current Balance: $${branch.balance.toLocaleString()}
${'='.repeat(80)}

${'Date'.padEnd(20)}${'Type'.padEnd(15)}${'Amount'.padEnd(15)}${'Balance'.padEnd(15)}Performed By
${'-'.repeat(80)}
${transactions.map(t => 
  `${t.date.padEnd(20)}${t.type.toUpperCase().padEnd(15)}$${t.amount.toLocaleString().padEnd(14)}$${t.balance.toLocaleString().padEnd(14)}${t.performedBy}`
).join('\n')}
${'-'.repeat(80)}

Total Deposits: $${transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
Total Withdrawals: $${transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
Total Commissions: $${transactions.filter(t => t.type === 'commission').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}

Total Transactions: ${transactions.length}
${'='.repeat(80)}

This is an official document from Imtiaz Trading Platform.
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${branch.code}_Transactions_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('✅ Transaction report exported successfully!');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="w-72 bg-slate-800/50 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="text-2xl font-bold text-emerald-400">Manager Panel</div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {['overview', 'branches', 'lps', 'routing', 'wallet', 'analytics'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full px-4 py-3 rounded-lg text-left capitalize ${activeTab === tab ? 'bg-emerald-600' : 'bg-slate-700'}`}>
              {tab === 'lps' ? 'Liquidity Providers' : tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="text-sm font-semibold">{user.name}</div>
          <button onClick={onLogout} className="text-red-400 text-sm mt-2">Logout</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-6">System Management</h1>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400">Branches</div>
              <div className="text-3xl font-bold">{branches.length}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400">LPs</div>
              <div className="text-3xl font-bold">{lps.length}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400">Total Clients</div>
              <div className="text-3xl font-bold">{branches.reduce((sum, b) => sum + b.clients, 0)}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400">Total Balance</div>
              <div className="text-3xl font-bold">${(branches.reduce((sum, b) => sum + b.balance, 0) / 1000000).toFixed(1)}M</div>
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Branch Management</h2>
              <button onClick={() => setShowAddBranch(true)} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Branch</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {branches.map(branch => (
                <div key={branch.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xl font-bold">{branch.name}</div>
                      <div className="text-sm text-slate-400">{branch.code}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/20 text-emerald-400">{branch.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <div className="text-slate-400 text-sm">Clients</div>
                      <div className="text-2xl font-bold">{branch.clients}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Balance</div>
                      <div className="text-2xl font-bold">${(branch.balance / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Leverage</div>
                      <div className="text-2xl font-bold text-purple-400">1:{branch.leverage}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Commission</div>
                      <div className="text-2xl font-bold text-emerald-400">${branch.commissionPerLot}</div>
                      <div className="text-xs text-slate-500">per lot</div>
                    </div>
                  </div>

                  {/* Admin Status */}
                  {branch.admin && (
                    <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-xs text-slate-400">Branch Admin</div>
                          <div className="text-sm font-semibold">{branch.admin.name}</div>
                          <div className="text-xs text-slate-500">{branch.admin.email}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${branch.admin.status === 'active' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}>
                          {branch.admin.status}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button onClick={() => openDepositModal(branch)} className="bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg text-sm font-semibold">
                      <Download size={16} className="inline mr-1" />
                      Deposit
                    </button>
                    <button onClick={() => openWithdrawModal(branch)} className="bg-amber-600 hover:bg-amber-700 py-2 rounded-lg text-sm font-semibold">
                      <Upload size={16} className="inline mr-1" />
                      Withdraw
                    </button>
                  </div>
                  
                  <button onClick={() => openTransactionHistory(branch)} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold mb-2">
                    <FileText size={16} className="inline mr-1" />
                    Transaction History
                  </button>
                  
                  {branch.admin && (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button onClick={() => handleFreezeAdmin(branch.id)} className={`py-2 rounded-lg text-sm font-semibold ${branch.admin.status === 'active' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                        {branch.admin.status === 'active' ? 'Freeze Admin' : 'Activate Admin'}
                      </button>
                      <button onClick={() => handleOpenEditAdmin(branch)} className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold">
                        <Key size={16} className="inline mr-1" />
                        Reset Pass
                      </button>
                    </div>
                  )}
                  
                  <button onClick={() => handleDeleteBranch(branch.id)} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm font-semibold">Delete Branch</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lps' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Liquidity Providers</h2>
              <button onClick={() => setShowAddLP(true)} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                <Plus size={20} />
                <span>Add LP</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {lps.map(lp => (
                <div key={lp.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xl font-bold">{lp.name}</div>
                      <div className="text-sm text-slate-400">{lp.type}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lp.status === 'connected' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}>{lp.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400">Latency</div>
                      <div className="text-lg font-bold">{lp.latency}ms</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400">Spread</div>
                      <div className="text-lg font-bold">{lp.spread || 0}pips</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400">Uptime</div>
                      <div className="text-lg font-bold text-emerald-400">{lp.uptime}%</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mb-2">
                    <div>Server: {lp.server}</div>
                    <div>Login: {lp.login}</div>
                  </div>
                  <button onClick={() => handleDeleteLP(lp.id)} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm font-semibold">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'routing' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Routing Rules</h2>
              <button onClick={() => setShowAddRoutingRule(true)} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Rule</span>
              </button>
            </div>
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-300">Routing rules define which liquidity provider handles specific symbols and order types. Orders matching these rules are automatically routed to the specified LP.</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="text-left py-4 px-6 text-slate-400">Symbol</th>
                    <th className="text-left py-4 px-6 text-slate-400">Side</th>
                    <th className="text-left py-4 px-6 text-slate-400">Liquidity Provider</th>
                    <th className="text-left py-4 px-6 text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {routingRules.map(rule => (
                    <tr key={rule.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-4 px-6 font-semibold">{rule.symbol}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rule.side === 'BUY' ? 'bg-blue-600/20 text-blue-400' : 'bg-red-600/20 text-red-400'}`}>
                          {rule.side}
                        </span>
                      </td>
                      <td className="py-4 px-6">{rule.lpName}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => handleDeleteRoutingRule(rule.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {routingRules.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 px-6 text-center text-slate-400">No routing rules configured</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Manager Wallet</h2>
                <p className="text-sm text-slate-400 mt-1">Central wallet for branch funding and management</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => setShowManagerDepositModal(true)} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                  <Plus size={20} />
                  <span>Deposit</span>
                </button>
                <button onClick={() => setShowManagerWithdrawModal(true)} className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                  <Download size={20} />
                  <span>Withdraw</span>
                </button>
                <button onClick={() => setShowBranchTransferModal(true)} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                  <TrendingUp size={20} />
                  <span>Fund Branch</span>
                </button>
              </div>
            </div>

            {/* Manager Wallet Balance Card */}
            <div className="bg-gradient-to-r from-purple-600/20 to-emerald-600/20 border border-purple-600/30 rounded-xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400 mb-2">Manager Wallet Balance</div>
                  <div className="text-6xl font-bold text-white mb-2">${managerWallet.toLocaleString()}</div>
                  <div className="text-sm text-slate-300">
                    💼 Central fund pool for all branch operations
                  </div>
                </div>
                <div className="text-9xl opacity-10">
                  <DollarSign size={140} />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Total Deposits</div>
                <div className="text-3xl font-bold text-emerald-400">
                  ${managerWalletTransactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Total Withdrawals</div>
                <div className="text-3xl font-bold text-red-400">
                  ${managerWalletTransactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Branch Transfers</div>
                <div className="text-3xl font-bold text-blue-400">
                  ${managerWalletTransactions.filter(t => t.type === 'transfer').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Manager Wallet Transactions */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-xl font-bold">Recent Wallet Activity</h3>
              </div>
              <div className="divide-y divide-slate-700">
                {managerWalletTransactions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No wallet transactions yet</div>
                ) : (
                  managerWalletTransactions.slice(0, 10).map(transaction => (
                    <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-slate-700/30">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-emerald-600/20 text-emerald-400' :
                          transaction.type === 'withdrawal' ? 'bg-red-600/20 text-red-400' :
                          'bg-blue-600/20 text-blue-400'
                        }`}>
                          {transaction.type === 'deposit' ? <Plus size={24} /> :
                           transaction.type === 'withdrawal' ? <Download size={24} /> :
                           <TrendingUp size={24} />}
                        </div>
                        <div>
                          <div className="font-semibold">{transaction.description}</div>
                          <div className="text-sm text-slate-400">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          transaction.type === 'deposit' ? 'text-emerald-400' :
                          transaction.type === 'withdrawal' ? 'text-red-400' :
                          'text-blue-400'
                        }`}>
                          {transaction.type === 'withdrawal' || transaction.type === 'transfer' ? '-' : '+'}${transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">{transaction.status}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">System Analytics</h2>
              <button onClick={() => setShowEmergencyTrade(true)} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                <AlertTriangle size={20} />
                <span>Emergency Trade</span>
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">System Health</span>
                  <Activity className="text-emerald-400" size={24} />
                </div>
                <div className="text-3xl font-bold text-emerald-400">Healthy</div>
                <div className="text-xs text-slate-400">All systems operational</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Avg Latency</span>
                  <Clock className="text-blue-400" size={24} />
                </div>
                <div className="text-3xl font-bold">{Math.round(lps.reduce((sum, lp) => sum + lp.latency, 0) / lps.length)}ms</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Active Routes</span>
                  <Globe className="text-purple-400" size={24} />
                </div>
                <div className="text-3xl font-bold">{routingRules.length}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Connected LPs</span>
                  <Server className="text-amber-400" size={24} />
                </div>
                <div className="text-3xl font-bold">{lps.filter(lp => lp.status === 'connected').length}/{lps.length}</div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Branch Admin Credentials</h3>
              <div className="space-y-3">
                {branches.map(branch => branch.admin && (
                  <div key={branch.id} className="bg-slate-900/50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{branch.name}</div>
                      <div className="text-sm text-slate-400">{branch.admin.name} • {branch.admin.email}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Password: {showPasswords[branch.id] ? branch.admin.password : '••••••••'}
                      </div>
                    </div>
                    <button onClick={() => togglePasswordVisibility(branch.id)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2">
                      {showPasswords[branch.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span>{showPasswords[branch.id] ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-600/10 border border-amber-600/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="text-amber-400" size={24} />
                <h3 className="text-xl font-bold">Emergency Trading</h3>
              </div>
              <p className="text-sm text-slate-300 mb-4">Execute trades on behalf of clients in emergency situations. All emergency trades are logged and require justification.</p>
              <button onClick={() => setShowEmergencyTrade(true)} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold">Open Emergency Trading</button>
            </div>
          </div>
        )}

        {/* Add Branch Modal */}
        {showAddBranch && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 my-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Add New Branch</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Branch Name *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newBranch.name} onChange={(e) => setNewBranch({...newBranch, name: e.target.value})} />
                <input type="text" placeholder="Branch Code *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newBranch.code} onChange={(e) => setNewBranch({...newBranch, code: e.target.value})} />
                <input type="text" placeholder="Address" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newBranch.address} onChange={(e) => setNewBranch({...newBranch, address: e.target.value})} />
                <input type="text" placeholder="Phone" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newBranch.phone} onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})} />
                
                {/* Company Logo Upload */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Company Logo (Optional)</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 cursor-pointer hover:bg-slate-800 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleLogoUpload}
                      />
                      <div className="flex items-center gap-2">
                        <Upload size={18} />
                        <span>{newBranch.logo ? 'Logo Uploaded' : 'Click to Upload Logo'}</span>
                      </div>
                    </label>
                    {newBranch.logo && (
                      <div className="relative">
                        <img src={newBranch.logo} alt="Logo Preview" className="w-16 h-16 object-contain bg-white rounded-lg p-1" />
                        <button 
                          onClick={() => setNewBranch({...newBranch, logo: ''})} 
                          className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Max file size: 2MB. Recommended: Square logo, transparent background</p>
                </div>
                
                {/* Leverage Selection */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Trading Leverage *</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-semibold" value={newBranch.leverage} onChange={(e) => setNewBranch({...newBranch, leverage: e.target.value})}>
                    <option value="1">1:1 (No Leverage)</option>
                    <option value="10">1:10</option>
                    <option value="20">1:20</option>
                    <option value="50">1:50</option>
                    <option value="100">1:100 (Standard)</option>
                    <option value="200">1:200</option>
                    <option value="300">1:300</option>
                    <option value="400">1:400</option>
                    <option value="500">1:500 (High)</option>
                    <option value="1000">1:1000 (Maximum)</option>
                  </select>
                  <div className="mt-2 bg-purple-600/10 border border-purple-600/30 rounded-lg p-3">
                    <p className="text-xs text-slate-300">⚠️ Leverage multiplies both profits and losses. Higher leverage = Higher risk. Recommended: 1:100 for standard trading.</p>
                  </div>
                </div>

                {/* Commission Per Lot */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Commission Per Lot ($) *</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    placeholder="5.0" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-semibold" 
                    value={newBranch.commissionPerLot} 
                    onChange={(e) => setNewBranch({...newBranch, commissionPerLot: e.target.value})} 
                  />
                  <div className="mt-2 bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                    <p className="text-xs text-slate-300">💰 Commission charged to clients per lot traded. Standard range: $3-$10 per lot.</p>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="text-sm font-semibold text-slate-300 mb-3">Branch Admin (Optional)</div>
                  <input type="text" placeholder="Admin Name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white mb-3" value={newBranch.adminName} onChange={(e) => setNewBranch({...newBranch, adminName: e.target.value})} />
                  <input type="email" placeholder="Admin Email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white mb-3" value={newBranch.adminEmail} onChange={(e) => setNewBranch({...newBranch, adminEmail: e.target.value})} />
                  <input type="password" placeholder="Admin Password" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newBranch.adminPassword} onChange={(e) => setNewBranch({...newBranch, adminPassword: e.target.value})} />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button onClick={() => setShowAddBranch(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                <button onClick={handleAddBranch} className="flex-1 bg-emerald-600 py-3 rounded-lg font-semibold">Add Branch</button>
              </div>
            </div>
          </div>
        )}

        {/* Add LP Modal */}
        {showAddLP && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 my-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Add Liquidity Provider</h3>
              <div className="space-y-4">
                <input type="text" placeholder="LP Name *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.name} onChange={(e) => setNewLP({...newLP, name: e.target.value})} />
                
                {/* API Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">API Type *</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.type} onChange={(e) => setNewLP({...newLP, type: e.target.value})}>
                    <option value="REST+WebSocket">REST + WebSocket (Recommended - Hybrid)</option>
                    <option value="REST">REST API Only</option>
                    <option value="WebSocket">WebSocket API Only</option>
                    <option value="FIX">FIX API (Ultra-low latency HFT)</option>
                    <option value="MT5">MetaTrader 5 (MT5)</option>
                    <option value="MT4">MetaTrader 4 (MT4)</option>
                  </select>
                  <div className="mt-2 text-xs text-slate-400 bg-slate-900/50 rounded-lg p-2">
                    {newLP.type === 'REST+WebSocket' && '🚀 Optimal Setup: REST for operations (orders, balances) + WebSocket for real-time data (prices, order book)'}
                    {newLP.type === 'REST' && '📡 HTTP-based API for operations only - no real-time data'}
                    {newLP.type === 'WebSocket' && '⚡ Real-time data only - requires REST for operations'}
                    {newLP.type === 'FIX' && '💼 Ultra-low latency for high-frequency trading (HFT)'}
                    {(newLP.type === 'MT5' || newLP.type === 'MT4') && '📊 MetaTrader platform integration'}
                  </div>
                </div>

                {/* Credentials Section */}
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                  <div className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
                    <span>🔐 API Credentials</span>
                    {newLP.type === 'REST+WebSocket' && <span className="ml-2 text-xs bg-emerald-600/20 text-emerald-400 px-2 py-0.5 rounded">Complete Set</span>}
                  </div>
                  <div className="space-y-3">
                    {/* REST + WebSocket Hybrid (Recommended for Kraken, Binance, etc.) */}
                    {newLP.type === 'REST+WebSocket' && (
                      <>
                        <input type="text" placeholder="API Key * (for authentication)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.apiKey} onChange={(e) => setNewLP({...newLP, apiKey: e.target.value})} />
                        <input type="password" placeholder="API Secret * (for signing requests)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.apiSecret} onChange={(e) => setNewLP({...newLP, apiSecret: e.target.value})} />
                        <input type="password" placeholder="Passphrase (optional - some brokers require)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.passphrase} onChange={(e) => setNewLP({...newLP, passphrase: e.target.value})} />
                        <div className="grid grid-cols-1 gap-3">
                          <input type="text" placeholder="REST Base URL * (e.g., https://api.kraken.com)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.baseUrl} onChange={(e) => setNewLP({...newLP, baseUrl: e.target.value})} />
                          <input type="text" placeholder="WebSocket URL * (e.g., wss://ws.kraken.com)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.websocketUrl} onChange={(e) => setNewLP({...newLP, websocketUrl: e.target.value})} />
                        </div>
                        <div className="text-xs text-emerald-400 bg-emerald-600/10 rounded p-2">
                          ✓ REST for: Orders, Balances, Account Info, Historical Data<br/>
                          ✓ WebSocket for: Live Prices, Order Book, Trade Notifications
                        </div>
                      </>
                    )}

                    {/* MetaTrader (MT4/MT5) */}
                    {(newLP.type === 'MT5' || newLP.type === 'MT4') && (
                      <>
                        <input type="text" placeholder="Login ID *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.login} onChange={(e) => setNewLP({...newLP, login: e.target.value})} />
                        <input type="password" placeholder="Password *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.password} onChange={(e) => setNewLP({...newLP, password: e.target.value})} />
                        <input type="text" placeholder="Server Address * (e.g., mt5.broker.com:443)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.server} onChange={(e) => setNewLP({...newLP, server: e.target.value})} />
                      </>
                    )}

                    {/* FIX API */}
                    {newLP.type === 'FIX' && (
                      <>
                        <input type="text" placeholder="SenderCompID * (your company ID)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.apiKey} onChange={(e) => setNewLP({...newLP, apiKey: e.target.value})} />
                        <input type="text" placeholder="TargetCompID * (broker's company ID)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.apiSecret} onChange={(e) => setNewLP({...newLP, apiSecret: e.target.value})} />
                        <input type="password" placeholder="Password/Certificate * (authentication)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.passphrase} onChange={(e) => setNewLP({...newLP, passphrase: e.target.value})} />
                        <input type="text" placeholder="FIX Server * (e.g., fix.broker.com:4001)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.baseUrl} onChange={(e) => setNewLP({...newLP, baseUrl: e.target.value})} />
                      </>
                    )}

                    {/* REST API Only */}
                    {newLP.type === 'REST' && (
                      <>
                        <input type="text" placeholder="API Key *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.apiKey} onChange={(e) => setNewLP({...newLP, apiKey: e.target.value})} />
                        <input type="password" placeholder="API Secret *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.apiSecret} onChange={(e) => setNewLP({...newLP, apiSecret: e.target.value})} />
                        <input type="password" placeholder="Passphrase (if required)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.passphrase} onChange={(e) => setNewLP({...newLP, passphrase: e.target.value})} />
                        <input type="text" placeholder="Base URL * (e.g., https://api.broker.com)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.baseUrl} onChange={(e) => setNewLP({...newLP, baseUrl: e.target.value})} />
                      </>
                    )}

                    {/* WebSocket API Only */}
                    {newLP.type === 'WebSocket' && (
                      <>
                        <input type="text" placeholder="API Key *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.apiKey} onChange={(e) => setNewLP({...newLP, apiKey: e.target.value})} />
                        <input type="password" placeholder="API Secret *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.apiSecret} onChange={(e) => setNewLP({...newLP, apiSecret: e.target.value})} />
                        <input type="text" placeholder="WebSocket URL * (e.g., wss://stream.broker.com)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.websocketUrl} onChange={(e) => setNewLP({...newLP, websocketUrl: e.target.value})} />
                        <div className="text-xs text-amber-400 bg-amber-600/10 rounded p-2">
                          ⚠️ WebSocket only provides real-time data. You'll need REST API for operations.
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <input type="number" step="0.1" placeholder="Base Spread (pips)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.spread} onChange={(e) => setNewLP({...newLP, spread: e.target.value})} />
                <input type="number" step="0.1" placeholder="Expected Uptime (%)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newLP.uptime} onChange={(e) => setNewLP({...newLP, uptime: e.target.value})} />
                
                {/* Extra Spread Markup */}
                <div className="border-t border-slate-700 pt-4">
                  <div className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                    <span>Extra Spread Markup (pips)</span>
                    <span className="ml-2 text-xs bg-amber-600/20 text-amber-400 px-2 py-0.5 rounded">Profit Margin</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">EURUSD</label>
                      <input type="number" step="0.1" placeholder="0.5" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={newLP.extraSpread.EURUSD} onChange={(e) => setNewLP({...newLP, extraSpread: {...newLP.extraSpread, EURUSD: e.target.value}})} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">GBPUSD</label>
                      <input type="number" step="0.1" placeholder="0.5" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={newLP.extraSpread.GBPUSD} onChange={(e) => setNewLP({...newLP, extraSpread: {...newLP.extraSpread, GBPUSD: e.target.value}})} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">USDJPY</label>
                      <input type="number" step="0.1" placeholder="0.5" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={newLP.extraSpread.USDJPY} onChange={(e) => setNewLP({...newLP, extraSpread: {...newLP.extraSpread, USDJPY: e.target.value}})} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">XAUUSD</label>
                      <input type="number" step="0.1" placeholder="2.0" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={newLP.extraSpread.XAUUSD} onChange={(e) => setNewLP({...newLP, extraSpread: {...newLP.extraSpread, XAUUSD: e.target.value}})} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-slate-400 mb-1 block">BTCUSD</label>
                      <input type="number" step="1" placeholder="10.0" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" value={newLP.extraSpread.BTCUSD} onChange={(e) => setNewLP({...newLP, extraSpread: {...newLP.extraSpread, BTCUSD: e.target.value}})} />
                    </div>
                  </div>
                  <div className="mt-2 bg-amber-600/10 border border-amber-600/30 rounded-lg p-2">
                    <p className="text-xs text-slate-300">💡 Extra spread added to LP's base spread. This is your profit margin on each trade.</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button onClick={() => setShowAddLP(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                <button onClick={handleAddLP} className="flex-1 bg-emerald-600 py-3 rounded-lg font-semibold">Add LP</button>
              </div>
            </div>
          </div>
        )}

        {/* Branch Deposit Modal */}
        {showDepositModal && selectedBranch && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Deposit to Branch</h3>
                <button onClick={() => { setShowDepositModal(false); setSelectedBranch(null); setTransactionAmount(''); }}><X size={24} /></button>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <div className="text-sm text-slate-400">Branch</div>
                <div className="text-xl font-bold">{selectedBranch.name}</div>
                <div className="text-sm text-slate-400 mt-2">Current Balance</div>
                <div className="text-2xl font-bold text-emerald-400">${(selectedBranch.balance / 1000000).toFixed(2)}M</div>
              </div>
              <input type="number" placeholder="Deposit Amount" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white mb-4" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} />
              <button onClick={handleDeposit} className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold">Confirm Deposit</button>
            </div>
          </div>
        )}

        {/* Branch Withdraw Modal */}
        {showWithdrawModal && selectedBranch && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Withdraw from Branch</h3>
                <button onClick={() => { setShowWithdrawModal(false); setSelectedBranch(null); setTransactionAmount(''); }}><X size={24} /></button>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <div className="text-sm text-slate-400">Branch</div>
                <div className="text-xl font-bold">{selectedBranch.name}</div>
                <div className="text-sm text-slate-400 mt-2">Available Balance</div>
                <div className="text-2xl font-bold text-amber-400">${(selectedBranch.balance / 1000000).toFixed(2)}M</div>
              </div>
              <input type="number" placeholder="Withdrawal Amount" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white mb-4" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} />
              <button onClick={handleWithdraw} className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold">Confirm Withdrawal</button>
            </div>
          </div>
        )}

        {/* Add Routing Rule Modal */}
        {showAddRoutingRule && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Add Routing Rule</h3>
              <div className="space-y-4">
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newRoutingRule.symbol} onChange={(e) => setNewRoutingRule({...newRoutingRule, symbol: e.target.value})}>
                  <option value="EURUSD">EURUSD</option>
                  <option value="GBPUSD">GBPUSD</option>
                  <option value="USDJPY">USDJPY</option>
                  <option value="XAUUSD">XAUUSD (Gold)</option>
                  <option value="BTCUSD">BTCUSD</option>
                </select>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newRoutingRule.side} onChange={(e) => setNewRoutingRule({...newRoutingRule, side: e.target.value})}>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newRoutingRule.lpId} onChange={(e) => setNewRoutingRule({...newRoutingRule, lpId: e.target.value})}>
                  <option value="">Select Liquidity Provider</option>
                  {lps.map(lp => (
                    <option key={lp.id} value={lp.id}>{lp.name} ({lp.type})</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button onClick={() => setShowAddRoutingRule(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                <button onClick={handleAddRoutingRule} className="flex-1 bg-emerald-600 py-3 rounded-lg font-semibold">Add Rule</button>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Trade Modal */}
        {showEmergencyTrade && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-red-400">Emergency Trade Execution</h3>
                <button onClick={() => setShowEmergencyTrade(false)}><X size={24} /></button>
              </div>
              <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-300">⚠️ This will execute a trade on behalf of a client. Use only in emergency situations. All actions are logged.</p>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Client Account Number *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={emergencyTradeForm.clientAccount} onChange={(e) => setEmergencyTradeForm({...emergencyTradeForm, clientAccount: e.target.value})} />
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={emergencyTradeForm.symbol} onChange={(e) => setEmergencyTradeForm({...emergencyTradeForm, symbol: e.target.value})}>
                  <option value="EURUSD">EURUSD</option>
                  <option value="GBPUSD">GBPUSD</option>
                  <option value="XAUUSD">XAUUSD</option>
                  <option value="USDJPY">USDJPY</option>
                  <option value="BTCUSD">BTCUSD</option>
                </select>
                
                {/* Live Price Display */}
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-400">Live Market Prices</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-400">LIVE</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">BID (Sell Price)</div>
                      <div className="text-lg font-bold text-blue-400">
                        {marketPrices[emergencyTradeForm.symbol].bid.toFixed(emergencyTradeForm.symbol === 'XAUUSD' || emergencyTradeForm.symbol === 'BTCUSD' ? 2 : 5)}
                      </div>
                    </div>
                    <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">ASK (Buy Price)</div>
                      <div className="text-lg font-bold text-red-400">
                        {marketPrices[emergencyTradeForm.symbol].ask.toFixed(emergencyTradeForm.symbol === 'XAUUSD' || emergencyTradeForm.symbol === 'BTCUSD' ? 2 : 5)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Spread</span>
                    <span className="font-semibold text-amber-400">{marketPrices[emergencyTradeForm.symbol].spread.toFixed(1)} pips</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setEmergencyTradeForm({...emergencyTradeForm, type: 'BUY'})} className={`py-3 rounded-lg font-semibold ${emergencyTradeForm.type === 'BUY' ? 'bg-blue-600' : 'bg-slate-700'}`}>BUY</button>
                  <button onClick={() => setEmergencyTradeForm({...emergencyTradeForm, type: 'SELL'})} className={`py-3 rounded-lg font-semibold ${emergencyTradeForm.type === 'SELL' ? 'bg-red-600' : 'bg-slate-700'}`}>SELL</button>
                </div>
                <input type="number" step="0.01" placeholder="Lots *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={emergencyTradeForm.lots} onChange={(e) => setEmergencyTradeForm({...emergencyTradeForm, lots: e.target.value})} />
                <textarea placeholder="Reason for Emergency Trade *" rows="3" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={emergencyTradeForm.reason} onChange={(e) => setEmergencyTradeForm({...emergencyTradeForm, reason: e.target.value})}></textarea>
              </div>
              <button onClick={handleEmergencyTrade} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold mt-4">Execute Emergency Trade</button>
            </div>
          </div>
        )}

        {/* Transaction History Modal */}
        {showTransactionHistory && selectedBranch && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-4xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-800 pb-4 border-b border-slate-700">
                <div>
                  <h3 className="text-xl font-bold">Transaction History</h3>
                  <p className="text-sm text-slate-400">{selectedBranch.name} - {selectedBranch.code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => exportTransactionsToPDF(selectedBranch)} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center">
                    <Download size={16} className="mr-1" />
                    Export Report
                  </button>
                  <button onClick={() => setShowTransactionHistory(false)} className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-slate-400" />
                      <span className="text-sm font-semibold text-slate-300">Filter by Date:</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col">
                        <label className="text-xs text-slate-400 mb-1">From</label>
                        <input 
                          type="date" 
                          className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                          value={dateFilterFrom}
                          onChange={(e) => setDateFilterFrom(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-slate-400 mb-1">To</label>
                        <input 
                          type="date" 
                          className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                          value={dateFilterTo}
                          onChange={(e) => setDateFilterTo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  {(dateFilterFrom || dateFilterTo) && (
                    <button 
                      onClick={() => { setDateFilterFrom(''); setDateFilterTo(''); }}
                      className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 px-3 py-2 rounded text-sm font-semibold text-red-400"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                {(dateFilterFrom || dateFilterTo) && (
                  <div className="mt-3 text-xs text-slate-400">
                    Showing transactions from <strong className="text-emerald-400">{dateFilterFrom || 'beginning'}</strong> to <strong className="text-emerald-400">{dateFilterTo || 'now'}</strong>
                  </div>
                )}
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg p-4">
                  <div className="text-xs text-slate-400 mb-1">Current Balance</div>
                  <div className="text-2xl font-bold text-emerald-400">${selectedBranch.balance.toLocaleString()}</div>
                </div>
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                  <div className="text-xs text-slate-400 mb-1">Total Deposits</div>
                  <div className="text-2xl font-bold text-blue-400">
                    ${getFilteredTransactions().filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-4">
                  <div className="text-xs text-slate-400 mb-1">Total Withdrawals</div>
                  <div className="text-2xl font-bold text-amber-400">
                    ${getFilteredTransactions().filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                  <div className="text-xs text-slate-400 mb-1">Commissions Earned</div>
                  <div className="text-2xl font-bold text-purple-400">
                    ${getFilteredTransactions().filter(t => t.type === 'commission').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-slate-900/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left text-xs font-semibold text-slate-300 py-3 px-4">Date & Time</th>
                      <th className="text-left text-xs font-semibold text-slate-300 py-3 px-4">Type</th>
                      <th className="text-right text-xs font-semibold text-slate-300 py-3 px-4">Amount</th>
                      <th className="text-right text-xs font-semibold text-slate-300 py-3 px-4">Balance After</th>
                      <th className="text-left text-xs font-semibold text-slate-300 py-3 px-4">Description</th>
                      <th className="text-left text-xs font-semibold text-slate-300 py-3 px-4">Performed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredTransactions().slice().reverse().map((transaction, index) => (
                      <tr key={transaction.id} className={`border-t border-slate-700 ${index % 2 === 0 ? 'bg-slate-800/30' : ''}`}>
                        <td className="py-3 px-4 text-sm text-slate-300">{transaction.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            transaction.type === 'deposit' ? 'bg-emerald-600/20 text-emerald-400' :
                            transaction.type === 'withdrawal' ? 'bg-amber-600/20 text-amber-400' :
                            'bg-purple-600/20 text-purple-400'
                          }`}>
                            {transaction.type.toUpperCase()}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm font-semibold text-right ${
                          transaction.type === 'deposit' || transaction.type === 'commission' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300 text-right font-mono">${transaction.balance.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-slate-400">{transaction.description}</td>
                        <td className="py-3 px-4 text-sm text-slate-400">{transaction.performedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {getFilteredTransactions().length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <FileText size={48} className="mx-auto mb-3 opacity-50" />
                    <p>{dateFilterFrom || dateFilterTo ? 'No transactions found in selected date range' : 'No transactions recorded yet'}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center text-sm text-slate-400">
                <span>
                  {dateFilterFrom || dateFilterTo ? (
                    <>Filtered Transactions: {getFilteredTransactions().length} of {(selectedBranch.transactions || []).length}</>
                  ) : (
                    <>Total Transactions: {(selectedBranch.transactions || []).length}</>
                  )}
                </span>
                <span>Report Generated: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Edit Admin Password Modal */}
        {showEditAdminModal && selectedBranch && selectedAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Reset Admin Password</h3>
                <button onClick={() => setShowEditAdminModal(false)}><X size={24} /></button>
              </div>
              
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-4">
                <div className="text-sm font-semibold text-blue-400 mb-2">Admin Details</div>
                <div className="space-y-1 text-sm text-slate-300">
                  <div><strong>Branch:</strong> {selectedBranch.name}</div>
                  <div><strong>Admin:</strong> {selectedAdmin.name}</div>
                  <div><strong>Email:</strong> {selectedAdmin.email}</div>
                  <div className="flex items-center">
                    <strong>Status:</strong>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${selectedAdmin.status === 'active' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}>
                      {selectedAdmin.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">New Password *</label>
                  <input 
                    type="text" 
                    placeholder="Enter new password (min 6 characters)" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono" 
                    value={newAdminPassword} 
                    onChange={(e) => setNewAdminPassword(e.target.value)} 
                  />
                  <p className="text-xs text-slate-500 mt-1">This will replace the admin's current password</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button onClick={() => setShowEditAdminModal(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                <button onClick={handleUpdateAdminPassword} className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold">Update Password</button>
              </div>
            </div>
          </div>
        )}

        {/* Manager Wallet Deposit Modal */}
        {showManagerDepositModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Deposit to Manager Wallet</h3>
                <button onClick={() => setShowManagerDepositModal(false)}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-2xl font-bold" 
                    value={managerDepositAmount} 
                    onChange={(e) => setManagerDepositAmount(e.target.value)} 
                  />
                </div>
                <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg p-3">
                  <p className="text-xs text-slate-300">
                    💰 Add capital to your manager wallet for branch funding
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setShowManagerDepositModal(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                  <button onClick={handleManagerWalletDeposit} className="flex-1 bg-emerald-600 py-3 rounded-lg font-semibold">Deposit</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manager Wallet Withdraw Modal */}
        {showManagerWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Withdraw from Manager Wallet</h3>
                <button onClick={() => setShowManagerWithdrawModal(false)}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                  <div className="text-sm text-slate-400">Available Balance</div>
                  <div className="text-2xl font-bold">${managerWallet.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-2xl font-bold" 
                    value={managerWithdrawAmount} 
                    onChange={(e) => setManagerWithdrawAmount(e.target.value)} 
                  />
                </div>
                <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-3">
                  <p className="text-xs text-slate-300">
                    ⚠️ Withdrawal will be processed to your registered account
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setShowManagerWithdrawModal(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                  <button onClick={handleManagerWalletWithdraw} className="flex-1 bg-amber-600 py-3 rounded-lg font-semibold">Withdraw</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer to Branch Modal */}
        {showBranchTransferModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Transfer to Branch</h3>
                <button onClick={() => setShowBranchTransferModal(false)}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                  <div className="text-sm text-slate-400">Manager Wallet Balance</div>
                  <div className="text-2xl font-bold">${managerWallet.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Select Branch</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-semibold"
                    value={selectedBranchForTransfer}
                    onChange={(e) => setSelectedBranchForTransfer(e.target.value)}
                  >
                    <option value="">Choose a branch...</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} ({branch.code}) - Balance: ${branch.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-2xl font-bold" 
                    value={branchTransferAmount} 
                    onChange={(e) => setBranchTransferAmount(e.target.value)} 
                  />
                </div>
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                  <p className="text-xs text-slate-300">
                    🏢 Fund branch operations and liquidity from your manager wallet
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setShowBranchTransferModal(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                  <button onClick={handleTransferToBranch} className="flex-1 bg-blue-600 py-3 rounded-lg font-semibold">Transfer</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== ADMIN DASHBOARD ====================
const AdminDashboard = ({ user, branch, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [referralCopied, setReferralCopied] = useState(false);
  const [clients, setClients] = useState([
    { 
      id: 1, name: 'John Smith', email: 'john@example.com', account: 'ACC-10001', 
      balance: 50000, equity: 52500, freeMargin: 47500, marginLevel: 1050, usedMargin: 5000,
      status: 'active', password: 'client123', accountType: 'standard',
      openPositions: 3, totalProfit: 2500, todayTrades: 5, lastActive: '2024-11-19 14:30'
    },
    { 
      id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', account: 'ACC-10002', 
      balance: 75000, equity: 76850, freeMargin: 68350, marginLevel: 902, usedMargin: 8500,
      status: 'active', password: 'client456', accountType: 'business',
      openPositions: 5, totalProfit: 1850, todayTrades: 12, lastActive: '2024-11-19 15:45'
    }
  ]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClientPassword, setNewClientPassword] = useState('');
  const [showClientPasswords, setShowClientPasswords] = useState({});
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', initialDeposit: '', password: '', accountType: 'standard' });
  
  // Client positions modal states
  const [showClientPositionsModal, setShowClientPositionsModal] = useState(false);
  const [clientPositions, setClientPositions] = useState({
    1: [ // John Smith positions
      { id: 'P1001', symbol: 'EURUSD', type: 'BUY', lots: 0.5, openPrice: 1.09450, currentPrice: 1.09580, openTime: '2024-11-19 09:15', profit: 65.00, sl: 1.09200, tp: 1.09800 },
      { id: 'P1002', symbol: 'XAUUSD', type: 'SELL', lots: 0.1, openPrice: 2660.50, currentPrice: 2658.20, openTime: '2024-11-19 11:30', profit: 23.00, sl: 2665.00, tp: 2650.00 },
      { id: 'P1003', symbol: 'GBPUSD', type: 'BUY', lots: 0.3, openPrice: 1.26420, currentPrice: 1.26485, openTime: '2024-11-19 13:45', profit: 19.50, sl: 1.26200, tp: 1.26700 }
    ],
    2: [ // Sarah Johnson positions
      { id: 'P2001', symbol: 'BTCUSD', type: 'BUY', lots: 0.05, openPrice: 90800.00, currentPrice: 91250.00, openTime: '2024-11-18 08:20', profit: 22.50, sl: 89500.00, tp: 93000.00 },
      { id: 'P2002', symbol: 'EURUSD', type: 'SELL', lots: 0.8, openPrice: 1.09520, currentPrice: 1.09485, openTime: '2024-11-19 07:10', profit: 28.00, sl: 1.09700, tp: 1.09200 },
      { id: 'P2003', symbol: 'USDJPY', type: 'BUY', lots: 0.4, openPrice: 149.780, currentPrice: 149.830, openTime: '2024-11-19 10:25', profit: 13.36, sl: 149.500, tp: 150.200 },
      { id: 'P2004', symbol: 'XAUUSD', type: 'BUY', lots: 0.2, openPrice: 2655.80, currentPrice: 2658.20, openTime: '2024-11-19 12:50', profit: 48.00, sl: 2650.00, tp: 2670.00 },
      { id: 'P2005', symbol: 'GBPUSD', type: 'SELL', lots: 0.5, openPrice: 1.26550, currentPrice: 1.26478, openTime: '2024-11-19 14:15', profit: 36.00, sl: 1.26750, tp: 1.26250 }
    ]
  });
  
  // Wallet states
  const [walletBalance, setWalletBalance] = useState(50000);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferToClient, setTransferToClient] = useState('');
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 1, date: '2024-11-18 10:00', type: 'deposit', amount: 25000, description: 'Bank deposit', status: 'completed' },
    { id: 2, date: '2024-11-18 14:30', type: 'transfer', amount: 5000, description: 'Transfer to John Smith', status: 'completed' },
    { id: 3, date: '2024-11-19 09:15', type: 'deposit', amount: 30000, description: 'Wire transfer', status: 'completed' }
  ]);

  // Transaction history states
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-11-15 10:30', type: 'deposit', clientName: 'John Smith', clientAccount: 'ACC-10001', amount: 10000, description: 'Initial deposit', performedBy: user.name },
    { id: 2, date: '2024-11-16 14:20', type: 'withdrawal', clientName: 'Sarah Johnson', clientAccount: 'ACC-10002', amount: 5000, description: 'Withdrawal request', performedBy: user.name },
    { id: 3, date: '2024-11-17 09:15', type: 'deposit', clientName: 'John Smith', clientAccount: 'ACC-10001', amount: 15000, description: 'Additional funding', performedBy: user.name },
    { id: 4, date: '2024-11-18 16:45', type: 'commission', clientName: 'Sarah Johnson', clientAccount: 'ACC-10002', amount: 250, description: 'Trading commission', performedBy: 'System' }
  ]);
  const [dateFilterFrom, setDateFilterFrom] = useState('');
  const [dateFilterTo, setDateFilterTo] = useState('');

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) { alert('Please fill required fields'); return; }
    if (!newClient.password || newClient.password.length < 6) { alert('Password must be at least 6 characters'); return; }
    const accountNumber = `ACC-${Math.floor(10000 + Math.random() * 90000)}`;
    const accountTypeName = newClient.accountType === 'business' ? 'Business' : 'Standard';
    setClients([...clients, { id: Date.now(), name: newClient.name, email: newClient.email, phone: newClient.phone, account: accountNumber, balance: parseFloat(newClient.initialDeposit) || 0, status: 'active', password: newClient.password, accountType: newClient.accountType }]);
    alert(`✅ Client added successfully!\n\nAccount: ${accountNumber}\nAccount Type: ${accountTypeName}\nEmail: ${newClient.email}\nPassword: ${newClient.password}\n\nPlease share these credentials with the client.`);
    setNewClient({ name: '', email: '', phone: '', initialDeposit: '', password: '', accountType: 'standard' });
    setShowAddClient(false);
  };

  const handleFreezeClient = (id) => {
    setClients(clients.map(c => c.id === id ? {...c, status: c.status === 'active' ? 'frozen' : 'active'} : c));
  };

  const handleOpenChangePassword = (client) => {
    setSelectedClient(client);
    setNewClientPassword('');
    setShowChangePasswordModal(true);
  };

  const handleViewClientPositions = (client) => {
    setSelectedClient(client);
    setShowClientPositionsModal(true);
  };

  const handleCloseClientPosition = (positionId) => {
    if (!confirm('Are you sure you want to close this position?')) return;
    
    const position = clientPositions[selectedClient.id].find(p => p.id === positionId);
    if (!position) return;
    
    // Remove position from client's positions
    setClientPositions({
      ...clientPositions,
      [selectedClient.id]: clientPositions[selectedClient.id].filter(p => p.id !== positionId)
    });
    
    // Update client's open positions count and profit
    setClients(clients.map(c => {
      if (c.id === selectedClient.id) {
        return {
          ...c,
          openPositions: c.openPositions - 1,
          totalProfit: c.totalProfit - position.profit,
          equity: c.equity - position.profit
        };
      }
      return c;
    }));
    
    alert(`✅ Position ${positionId} closed successfully!\n\nProfit/Loss: $${position.profit.toFixed(2)}\nClosed at: ${position.currentPrice}`);
  };

  const handleChangePassword = () => {
    if (!newClientPassword || newClientPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setClients(clients.map(c => 
      c.id === selectedClient.id ? {...c, password: newClientPassword} : c
    ));
    alert(`✅ Password updated successfully!\n\nAccount: ${selectedClient.account}\nNew Password: ${newClientPassword}`);
    setNewClientPassword('');
    setShowChangePasswordModal(false);
    setSelectedClient(null);
  };

  const toggleShowPassword = (clientId) => {
    setShowClientPasswords(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  // Wallet functions
  const handleWalletDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    setWalletBalance(walletBalance + amount);
    setWalletTransactions([{ id: Date.now(), date: new Date().toLocaleString(), type: 'deposit', amount, description: 'Wallet deposit', status: 'completed' }, ...walletTransactions]);
    setDepositAmount('');
    setShowDepositModal(false);
    alert(`✅ Deposited $${amount.toLocaleString()} to wallet`);
  };

  const handleWalletWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    if (amount > walletBalance) { alert('Insufficient wallet balance'); return; }
    setWalletBalance(walletBalance - amount);
    setWalletTransactions([{ id: Date.now(), date: new Date().toLocaleString(), type: 'withdrawal', amount, description: 'Wallet withdrawal', status: 'completed' }, ...walletTransactions]);
    setWithdrawAmount('');
    setShowWithdrawModal(false);
    alert(`✅ Withdrew $${amount.toLocaleString()} from wallet`);
  };

  const handleTransferToClient = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    if (amount > walletBalance) { alert('Insufficient wallet balance'); return; }
    if (!transferToClient) { alert('Please select a client'); return; }
    
    const client = clients.find(c => c.id === parseInt(transferToClient));
    if (!client) { alert('Client not found'); return; }
    
    setWalletBalance(walletBalance - amount);
    setClients(clients.map(c => c.id === client.id ? {...c, balance: c.balance + amount} : c));
    setWalletTransactions([{ id: Date.now(), date: new Date().toLocaleString(), type: 'transfer', amount, description: `Transfer to ${client.name}`, status: 'completed' }, ...walletTransactions]);
    setTransactions([{ id: Date.now(), date: new Date().toLocaleString(), type: 'deposit', clientName: client.name, clientAccount: client.account, amount, description: `Admin transfer from wallet`, performedBy: user.name }, ...transactions]);
    
    setTransferAmount('');
    setTransferToClient('');
    setShowTransferModal(false);
    alert(`✅ Transferred $${amount.toLocaleString()} to ${client.name}`);
  };

  // Transaction history functions
  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      const transDate = new Date(t.date);
      const fromDate = dateFilterFrom ? new Date(dateFilterFrom) : null;
      const toDate = dateFilterTo ? new Date(dateFilterTo + 'T23:59:59') : null;
      
      if (fromDate && transDate < fromDate) return false;
      if (toDate && transDate > toDate) return false;
      return true;
    });
  };

  const exportTransactionsToPDF = () => {
    const filtered = getFilteredTransactions();
    const dateRange = dateFilterFrom && dateFilterTo 
      ? `${dateFilterFrom} to ${dateFilterTo}` 
      : dateFilterFrom 
        ? `From ${dateFilterFrom}` 
        : dateFilterTo 
          ? `Until ${dateFilterTo}` 
          : 'All transactions';
    
    let content = `${user.branchName} - Transaction History Report\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Period: ${dateRange}\n`;
    content += `Admin: ${user.name}\n`;
    content += `\n${'='.repeat(80)}\n\n`;
    
    filtered.forEach(t => {
      content += `Date: ${t.date}\n`;
      content += `Type: ${t.type.toUpperCase()}\n`;
      content += `Client: ${t.clientName} (${t.clientAccount})\n`;
      content += `Amount: $${t.amount.toLocaleString()}\n`;
      content += `Description: ${t.description}\n`;
      content += `Performed By: ${t.performedBy}\n`;
      content += `${'-'.repeat(80)}\n\n`;
    });
    
    const deposits = filtered.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
    const withdrawals = filtered.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0);
    const commissions = filtered.filter(t => t.type === 'commission').reduce((sum, t) => sum + t.amount, 0);
    
    content += `\n${'='.repeat(80)}\n`;
    content += `SUMMARY\n`;
    content += `${'='.repeat(80)}\n`;
    content += `Total Deposits: $${deposits.toLocaleString()}\n`;
    content += `Total Withdrawals: $${withdrawals.toLocaleString()}\n`;
    content += `Total Commissions: $${commissions.toLocaleString()}\n`;
    content += `Net Flow: $${(deposits - withdrawals).toLocaleString()}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${dateFilterFrom || 'all'}_${dateFilterTo || 'all'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="w-72 bg-slate-800/50 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          {branch?.logo ? (
            <div className="mb-3">
              <img src={branch.logo} alt={branch.name} className="w-16 h-16 object-contain bg-white rounded-lg p-2 mb-2" />
            </div>
          ) : null}
          <div className="text-2xl font-bold text-blue-400">Admin Panel</div>
          <div className="text-xs text-slate-400">{branch?.name || user.branchName}</div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {['overview', 'clients', 'client-tracking', 'wallet', 'transactions'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full px-4 py-3 rounded-lg text-left ${activeTab === tab ? 'bg-blue-600' : 'bg-slate-700'}`}>
              {tab === 'client-tracking' ? 'Client Tracking' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="text-sm font-semibold">{user.name}</div>
          <button onClick={onLogout} className="text-red-400 text-sm mt-2">Logout</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Branch Administration</h1>
        <p className="text-slate-400 mb-6">{user.branchName}</p>

        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-600/30 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-2">Branch Referral Code</h3>
          <p className="text-sm text-slate-300 mb-4">Share with new clients</p>
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900/50 rounded-lg px-6 py-3 border border-slate-700">
              <span className="text-2xl font-mono font-bold text-purple-400">{user.referralCode}</span>
            </div>
            <button onClick={handleCopyReferral} className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg font-semibold flex items-center space-x-2">
              {referralCopied ? <CheckCircle size={20} /> : <Copy size={20} />}
              <span>{referralCopied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400">Total Clients</div>
              <div className="text-3xl font-bold">{clients.length}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400">Active</div>
              <div className="text-3xl font-bold text-emerald-400">{clients.filter(c => c.status === 'active').length}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-slate-400">Total Balance</div>
              <div className="text-3xl font-bold">${(clients.reduce((sum, c) => sum + c.balance, 0) / 1000).toFixed(0)}K</div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Client Management</h2>
              <button onClick={() => setShowAddClient(true)} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Client</span>
              </button>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900/50">
                      <th className="text-left py-4 px-6 text-slate-400">Name</th>
                    <th className="text-left py-4 px-6 text-slate-400">Account</th>
                    <th className="text-left py-4 px-6 text-slate-400">Type</th>
                    <th className="text-left py-4 px-6 text-slate-400">Password</th>
                    <th className="text-left py-4 px-6 text-slate-400">Balance</th>
                    <th className="text-left py-4 px-6 text-slate-400">Status</th>
                    <th className="text-left py-4 px-6 text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-4 px-6">
                        <div className="font-semibold">{client.name}</div>
                        <div className="text-sm text-slate-400">{client.email}</div>
                      </td>
                      <td className="py-4 px-6 font-mono">{client.account}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          client.accountType === 'business' 
                            ? 'bg-purple-600/20 text-purple-400' 
                            : 'bg-cyan-600/20 text-cyan-400'
                        }`}>
                          {client.accountType === 'business' ? 'Business' : 'Standard'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {showClientPasswords[client.id] ? client.password : '•'.repeat(8)}
                          </span>
                          <button onClick={() => toggleShowPassword(client.id)} className="text-slate-400 hover:text-white">
                            {showClientPasswords[client.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold">${client.balance.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${client.status === 'active' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button onClick={() => handleFreezeClient(client.id)} className={`px-3 py-2 rounded-lg text-xs font-semibold ${client.status === 'active' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                            {client.status === 'active' ? 'Freeze' : 'Activate'}
                          </button>
                          <button onClick={() => handleOpenChangePassword(client)} className="px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700">
                            <Key size={14} className="inline mr-1" />
                            Change Pass
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'client-tracking' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Client Tracking</h2>
                <p className="text-sm text-slate-400 mt-1">Real-time monitoring of client trading activity</p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 rounded-xl p-6 border border-blue-600/30">
                <div className="text-sm text-slate-400 mb-2">Total Equity</div>
                <div className="text-3xl font-bold text-blue-400">
                  ${clients.reduce((sum, c) => sum + c.equity, 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-2">Across all clients</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 rounded-xl p-6 border border-emerald-600/30">
                <div className="text-sm text-slate-400 mb-2">Open Positions</div>
                <div className="text-3xl font-bold text-emerald-400">
                  {clients.reduce((sum, c) => sum + c.openPositions, 0)}
                </div>
                <div className="text-xs text-slate-500 mt-2">Active trades</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 rounded-xl p-6 border border-purple-600/30">
                <div className="text-sm text-slate-400 mb-2">Total Profit/Loss</div>
                <div className="text-3xl font-bold text-purple-400">
                  ${clients.reduce((sum, c) => sum + c.totalProfit, 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-2">Unrealized P&L</div>
              </div>
              <div className="bg-gradient-to-br from-amber-600/20 to-amber-600/5 rounded-xl p-6 border border-amber-600/30">
                <div className="text-sm text-slate-400 mb-2">Trades Today</div>
                <div className="text-3xl font-bold text-amber-400">
                  {clients.reduce((sum, c) => sum + c.todayTrades, 0)}
                </div>
                <div className="text-xs text-slate-500 mt-2">Total volume</div>
              </div>
            </div>

            {/* Client Activity Cards */}
            <div className="space-y-4">
              {clients.map(client => {
                const marginHealthColor = 
                  client.marginLevel >= 500 ? 'emerald' : 
                  client.marginLevel >= 200 ? 'amber' : 'red';
                const marginHealthText = 
                  client.marginLevel >= 500 ? 'Healthy' : 
                  client.marginLevel >= 200 ? 'Warning' : 'Critical';
                
                return (
                  <div key={client.id} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                    {/* Client Header */}
                    <div className="bg-slate-900/50 p-6 border-b border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <div className="text-xl font-bold">{client.name}</div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                client.accountType === 'business' 
                                  ? 'bg-purple-600/20 text-purple-400' 
                                  : 'bg-cyan-600/20 text-cyan-400'
                              }`}>
                                {client.accountType === 'business' ? 'Business' : 'Standard'}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                client.status === 'active' 
                                  ? 'bg-emerald-600/20 text-emerald-400' 
                                  : 'bg-red-600/20 text-red-400'
                              }`}>
                                {client.status === 'active' ? 'Active' : 'Frozen'}
                              </span>
                            </div>
                            <div className="text-sm text-slate-400 mt-1">
                              {client.account} • {client.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Last Active</div>
                          <div className="text-sm font-semibold">{client.lastActive}</div>
                        </div>
                      </div>
                    </div>

                    {/* Account Metrics */}
                    <div className="p-6">
                      <div className="grid grid-cols-5 gap-4">
                        {/* Balance */}
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <div className="text-xs text-slate-400 mb-1">Balance</div>
                          <div className="text-xl font-bold text-white">
                            ${client.balance.toLocaleString()}
                          </div>
                        </div>

                        {/* Equity */}
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <div className="text-xs text-slate-400 mb-1">Equity</div>
                          <div className="text-xl font-bold text-blue-400">
                            ${client.equity.toLocaleString()}
                          </div>
                          <div className={`text-xs mt-1 ${
                            client.equity > client.balance ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {client.equity > client.balance ? '+' : ''}
                            ${(client.equity - client.balance).toLocaleString()}
                          </div>
                        </div>

                        {/* Free Margin */}
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <div className="text-xs text-slate-400 mb-1">Free Margin</div>
                          <div className="text-xl font-bold text-emerald-400">
                            ${client.freeMargin.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Used: ${client.usedMargin.toLocaleString()}
                          </div>
                        </div>

                        {/* Margin Level */}
                        <div className={`bg-${marginHealthColor}-600/10 border border-${marginHealthColor}-600/30 rounded-lg p-4`}>
                          <div className="text-xs text-slate-400 mb-1">Margin Level</div>
                          <div className={`text-xl font-bold text-${marginHealthColor}-400`}>
                            {client.marginLevel}%
                          </div>
                          <div className={`text-xs mt-1 text-${marginHealthColor}-400`}>
                            {marginHealthText}
                          </div>
                        </div>

                        {/* Profit/Loss */}
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <div className="text-xs text-slate-400 mb-1">Unrealized P&L</div>
                          <div className={`text-xl font-bold ${
                            client.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {client.totalProfit >= 0 ? '+' : ''}${client.totalProfit.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {((client.totalProfit / client.balance) * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {/* Trading Activity */}
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <button 
                          onClick={() => handleViewClientPositions(client)}
                          className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 hover:bg-blue-600/20 transition-all cursor-pointer text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-slate-400">Open Positions</div>
                              <div className="text-2xl font-bold text-blue-400">{client.openPositions}</div>
                              <div className="text-xs text-blue-400 mt-1">Click to view →</div>
                            </div>
                            <Activity size={32} className="text-blue-400 opacity-50" />
                          </div>
                        </button>

                        <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-slate-400">Trades Today</div>
                              <div className="text-2xl font-bold text-purple-400">{client.todayTrades}</div>
                            </div>
                            <TrendingUp size={32} className="text-purple-400 opacity-50" />
                          </div>
                        </div>

                        <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-slate-400">Account Health</div>
                              <div className={`text-2xl font-bold text-${marginHealthColor}-400`}>
                                {marginHealthText}
                              </div>
                            </div>
                            <BarChart3 size={32} className={`text-${marginHealthColor}-400 opacity-50`} />
                          </div>
                        </div>
                      </div>

                      {/* Risk Warnings & Liquidation Calculator */}
                      {client.equity <= 1000 && (
                        <div className={`mt-4 ${client.equity <= 5 ? 'bg-red-600/20' : client.equity <= 100 ? 'bg-red-600/10' : 'bg-amber-600/10'} border ${client.equity <= 5 ? 'border-red-600' : client.equity <= 100 ? 'border-red-600/30' : 'border-amber-600/30'} rounded-lg p-4 flex items-start space-x-3`}>
                          <AlertTriangle size={24} className={`${client.equity <= 100 ? 'text-red-400' : 'text-amber-400'} flex-shrink-0 mt-0.5 ${client.equity <= 5 ? 'animate-pulse' : ''}`} />
                          <div className="flex-1">
                            <div className={`text-sm font-semibold ${client.equity <= 100 ? 'text-red-400' : 'text-amber-400'}`}>
                              {client.equity <= 5 ? '💀 LIQUIDATION IN PROGRESS' : client.equity <= 100 ? '🚨 CRITICAL - Near Liquidation' : '⚠️ Low Balance Warning'}
                            </div>
                            <div className="text-xs text-slate-300 mt-1">
                              {client.equity <= 5 
                                ? `Account has reached minimum threshold of $5. All positions are being automatically closed to prevent negative balance.`
                                : client.equity <= 100 
                                ? `Only $${client.equity.toFixed(2)} remaining! Account will be liquidated at $5. Client MUST add funds immediately.`
                                : `Balance at $${client.equity.toFixed(2)}. Approaching liquidation threshold of $5. Recommend adding funds or closing positions.`}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Liquidation Risk Calculator */}
                      <div className="mt-4 bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-semibold text-slate-300">💀 Liquidation Risk Analysis</div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            client.equity <= 5 ? 'bg-red-600 text-white animate-pulse' :
                            client.equity <= 100 ? 'bg-red-600/30 text-red-400' :
                            client.equity <= 1000 ? 'bg-amber-600/30 text-amber-400' :
                            'bg-emerald-600/30 text-emerald-400'
                          }`}>
                            {client.equity <= 5 ? 'LIQUIDATING' :
                             client.equity <= 100 ? 'CRITICAL' :
                             client.equity <= 1000 ? 'AT RISK' :
                             'SAFE'}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          {/* Warning Level */}
                          <div className="bg-amber-600/10 border border-amber-600/30 rounded p-3">
                            <div className="text-slate-400 mb-1">Warning Level</div>
                            <div className="text-lg font-bold text-amber-400">$100.00</div>
                            <div className="text-slate-500 mt-1">
                              Critical low balance alert
                            </div>
                            <div className="mt-2 text-amber-400">
                              {client.equity > 100 
                                ? `✓ Above warning ($${(client.equity - 100).toLocaleString()} buffer)`
                                : `⚠ $${(100 - client.equity).toFixed(2)} below warning level`}
                            </div>
                          </div>

                          {/* Stop Out Level */}
                          <div className="bg-red-600/10 border border-red-600/30 rounded p-3">
                            <div className="text-slate-400 mb-1">Stop Out (Liquidation)</div>
                            <div className="text-lg font-bold text-red-400">$5.00</div>
                            <div className="text-slate-500 mt-1">
                              Minimum balance threshold
                            </div>
                            <div className="mt-2 text-red-400">
                              {client.equity > 5 
                                ? `$${(client.equity - 5).toLocaleString()} to liquidation`
                                : `🚨 LIQUIDATING NOW`}
                            </div>
                          </div>

                          {/* Max Loss Before Liquidation */}
                          <div className="bg-blue-600/10 border border-blue-600/30 rounded p-3">
                            <div className="text-slate-400 mb-1">Max Loss Allowable</div>
                            <div className="text-lg font-bold text-blue-400">
                              ${(client.equity - 5).toLocaleString()}
                            </div>
                            <div className="text-slate-500 mt-1">
                              Before automatic liquidation
                            </div>
                            <div className="mt-2 text-blue-400">
                              {((client.equity - 5) / client.balance * 100).toFixed(1)}% of balance
                            </div>
                          </div>
                        </div>

                        {/* Action Timeline */}
                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <div className="text-xs text-slate-400 mb-2">📊 What happens next:</div>
                          <div className="space-y-1 text-xs">
                            {client.equity > 1000 && (
                              <div className="flex items-center text-emerald-400">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                                <span>✓ Account healthy - No action required</span>
                              </div>
                            )}
                            {client.equity <= 1000 && client.equity > 100 && (
                              <div className="flex items-center text-amber-400">
                                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                <span>⚠️ Low balance warning - Add funds or reduce exposure</span>
                              </div>
                            )}
                            {client.equity <= 100 && client.equity > 5 && (
                              <div className="flex items-center text-red-400">
                                <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                                <span>🚨 CRITICAL - Only ${client.equity.toFixed(2)} remaining before liquidation</span>
                              </div>
                            )}
                            {client.equity <= 5 && (
                              <div className="flex items-center text-red-400 font-bold">
                                <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                                <span>💀 STOP OUT - Account at $5 minimum, positions liquidated automatically</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Wallet</h2>
              <div className="flex space-x-3">
                <button onClick={() => setShowDepositModal(true)} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                  <Plus size={20} />
                  <span>Deposit</span>
                </button>
                <button onClick={() => setShowWithdrawModal(true)} className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                  <Download size={20} />
                  <span>Withdraw</span>
                </button>
                <button onClick={() => setShowTransferModal(true)} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                  <TrendingUp size={20} />
                  <span>Transfer to Client</span>
                </button>
              </div>
            </div>

            {/* Wallet Balance Card */}
            <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-600/30 rounded-xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400 mb-2">Available Wallet Balance</div>
                  <div className="text-5xl font-bold text-white mb-2">${walletBalance.toLocaleString()}</div>
                  <div className="text-sm text-slate-300">
                    💳 Use wallet to fund client accounts instantly
                  </div>
                </div>
                <div className="text-8xl opacity-10">
                  <DollarSign size={120} />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Total Deposits</div>
                <div className="text-3xl font-bold text-emerald-400">
                  ${walletTransactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Total Withdrawals</div>
                <div className="text-3xl font-bold text-red-400">
                  ${walletTransactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Transfers to Clients</div>
                <div className="text-3xl font-bold text-blue-400">
                  ${walletTransactions.filter(t => t.type === 'transfer').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Wallet Transactions */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-xl font-bold">Recent Wallet Activity</h3>
              </div>
              <div className="divide-y divide-slate-700">
                {walletTransactions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No wallet transactions yet</div>
                ) : (
                  walletTransactions.slice(0, 10).map(transaction => (
                    <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-slate-700/30">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-emerald-600/20 text-emerald-400' :
                          transaction.type === 'withdrawal' ? 'bg-red-600/20 text-red-400' :
                          'bg-blue-600/20 text-blue-400'
                        }`}>
                          {transaction.type === 'deposit' ? <Plus size={24} /> :
                           transaction.type === 'withdrawal' ? <Download size={24} /> :
                           <TrendingUp size={24} />}
                        </div>
                        <div>
                          <div className="font-semibold">{transaction.description}</div>
                          <div className="text-sm text-slate-400">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          transaction.type === 'deposit' ? 'text-emerald-400' :
                          transaction.type === 'withdrawal' ? 'text-red-400' :
                          'text-blue-400'
                        }`}>
                          {transaction.type === 'withdrawal' || transaction.type === 'transfer' ? '-' : '+'}${transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">{transaction.status}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Transaction History</h2>
              <button 
                onClick={exportTransactionsToPDF}
                disabled={getFilteredTransactions().length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
              >
                <Download size={20} />
                <span>Export Report</span>
              </button>
            </div>

            {/* Date Range Filter */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-sm text-slate-400 mb-2 block">From Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                    value={dateFilterFrom}
                    onChange={(e) => setDateFilterFrom(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-slate-400 mb-2 block">To Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                    value={dateFilterTo}
                    onChange={(e) => setDateFilterTo(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => { setDateFilterFrom(''); setDateFilterTo(''); }}
                    className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-semibold"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-xs text-slate-400">Total Deposits</div>
                  <div className="text-xl font-bold text-emerald-400">
                    ${getFilteredTransactions().filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-xs text-slate-400">Total Withdrawals</div>
                  <div className="text-xl font-bold text-red-400">
                    ${getFilteredTransactions().filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-xs text-slate-400">Commissions</div>
                  <div className="text-xl font-bold text-amber-400">
                    ${getFilteredTransactions().filter(t => t.type === 'commission').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-xs text-slate-400">Net Flow</div>
                  <div className="text-xl font-bold text-blue-400">
                    ${(getFilteredTransactions().filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0) - 
                       getFilteredTransactions().filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="text-left py-4 px-6 text-slate-400">Date & Time</th>
                    <th className="text-left py-4 px-6 text-slate-400">Type</th>
                    <th className="text-left py-4 px-6 text-slate-400">Client</th>
                    <th className="text-left py-4 px-6 text-slate-400">Account</th>
                    <th className="text-left py-4 px-6 text-slate-400">Amount</th>
                    <th className="text-left py-4 px-6 text-slate-400">Description</th>
                    <th className="text-left py-4 px-6 text-slate-400">Performed By</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredTransactions().length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 px-6 text-center text-slate-400">
                        No transactions found for the selected date range
                      </td>
                    </tr>
                  ) : (
                    getFilteredTransactions().map(transaction => (
                      <tr key={transaction.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-4 px-6 text-sm">{transaction.date}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.type === 'deposit' ? 'bg-emerald-600/20 text-emerald-400' :
                            transaction.type === 'withdrawal' ? 'bg-red-600/20 text-red-400' :
                            'bg-amber-600/20 text-amber-400'
                          }`}>
                            {transaction.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">{transaction.clientName}</td>
                        <td className="py-4 px-6 font-mono text-sm">{transaction.clientAccount}</td>
                        <td className="py-4 px-6">
                          <span className={`font-semibold ${
                            transaction.type === 'deposit' ? 'text-emerald-400' : 
                            transaction.type === 'withdrawal' ? 'text-red-400' : 
                            'text-amber-400'
                          }`}>
                            {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-300">{transaction.description}</td>
                        <td className="py-4 px-6 text-sm text-slate-400">{transaction.performedBy}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Change Client Password Modal */}
        {showChangePasswordModal && selectedClient && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 my-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Change Client Password</h3>
                <button onClick={() => setShowChangePasswordModal(false)}><X size={24} /></button>
              </div>
              
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-4">
                <div className="text-sm font-semibold text-blue-400 mb-2">Client Details</div>
                <div className="space-y-1 text-sm text-slate-300">
                  <div><strong>Name:</strong> {selectedClient.name}</div>
                  <div><strong>Email:</strong> {selectedClient.email}</div>
                  <div><strong>Account:</strong> {selectedClient.account}</div>
                  <div className="flex items-center">
                    <strong>Status:</strong>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${selectedClient.status === 'active' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">New Password *</label>
                  <input 
                    type="text" 
                    placeholder="Enter new password (min 6 characters)" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono" 
                    value={newClientPassword} 
                    onChange={(e) => setNewClientPassword(e.target.value)} 
                  />
                  <p className="text-xs text-slate-500 mt-1">This will replace the client's current password</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button onClick={() => setShowChangePasswordModal(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                <button onClick={handleChangePassword} className="flex-1 bg-blue-600 py-3 rounded-lg font-semibold">Update Password</button>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Deposit to Wallet</h3>
                <button onClick={() => setShowDepositModal(false)}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-2xl font-bold" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(e.target.value)} 
                  />
                </div>
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                  <p className="text-xs text-slate-300">
                    💳 Funds will be added to your wallet balance instantly
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setShowDepositModal(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                  <button onClick={handleWalletDeposit} className="flex-1 bg-emerald-600 py-3 rounded-lg font-semibold">Deposit</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Withdraw from Wallet</h3>
                <button onClick={() => setShowWithdrawModal(false)}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                  <div className="text-sm text-slate-400">Available Balance</div>
                  <div className="text-2xl font-bold">${walletBalance.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-2xl font-bold" 
                    value={withdrawAmount} 
                    onChange={(e) => setWithdrawAmount(e.target.value)} 
                  />
                </div>
                <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-3">
                  <p className="text-xs text-slate-300">
                    ⚠️ Withdrawal will be processed to your registered bank account
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setShowWithdrawModal(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                  <button onClick={handleWalletWithdraw} className="flex-1 bg-amber-600 py-3 rounded-lg font-semibold">Withdraw</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer to Client Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Transfer to Client</h3>
                <button onClick={() => setShowTransferModal(false)}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                  <div className="text-sm text-slate-400">Wallet Balance</div>
                  <div className="text-2xl font-bold">${walletBalance.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Select Client</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-semibold"
                    value={transferToClient}
                    onChange={(e) => setTransferToClient(e.target.value)}
                  >
                    <option value="">Choose a client...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.account})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-2xl font-bold" 
                    value={transferAmount} 
                    onChange={(e) => setTransferAmount(e.target.value)} 
                  />
                </div>
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                  <p className="text-xs text-slate-300">
                    💸 Transfer funds directly from your wallet to client's trading account
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setShowTransferModal(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                  <button onClick={handleTransferToClient} className="flex-1 bg-blue-600 py-3 rounded-lg font-semibold">Transfer</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Client Modal */}
        {showAddClient && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 my-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Add New Client</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} />
                <input type="email" placeholder="Email *" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} />
                <input type="tel" placeholder="Phone" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newClient.phone} onChange={(e) => setNewClient({...newClient, phone: e.target.value})} />
                <input type="number" placeholder="Initial Deposit" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={newClient.initialDeposit} onChange={(e) => setNewClient({...newClient, initialDeposit: e.target.value})} />
                
                {/* Account Type Selection */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Account Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setNewClient({...newClient, accountType: 'standard'})} 
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${
                        newClient.accountType === 'standard' 
                          ? 'bg-cyan-600/20 border-cyan-600 text-cyan-400' 
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-sm font-semibold">Standard</div>
                      <div className="text-xs mt-1 opacity-75">Individual trader</div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewClient({...newClient, accountType: 'business'})} 
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${
                        newClient.accountType === 'business' 
                          ? 'bg-purple-600/20 border-purple-600 text-purple-400' 
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-sm font-semibold">Business</div>
                      <div className="text-xs mt-1 opacity-75">Corporate account</div>
                    </button>
                  </div>
                  <div className="mt-2 bg-blue-600/10 border border-blue-600/30 rounded-lg p-2">
                    <p className="text-xs text-slate-300">
                      {newClient.accountType === 'business' 
                        ? '🏢 Business accounts may have higher limits and additional features' 
                        : '👤 Standard accounts for individual retail traders'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Client Password *</label>
                  <input 
                    type="text" 
                    placeholder="Create password (min 6 characters)" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono" 
                    value={newClient.password} 
                    onChange={(e) => setNewClient({...newClient, password: e.target.value})} 
                  />
                  <p className="text-xs text-slate-500 mt-1">🔒 This password will be used by the client to log in</p>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button onClick={() => setShowAddClient(false)} className="flex-1 bg-slate-700 py-3 rounded-lg font-semibold">Cancel</button>
                <button onClick={handleAddClient} className="flex-1 bg-blue-600 py-3 rounded-lg font-semibold">Add Client</button>
              </div>
            </div>
          </div>
        )}

        {/* Client Positions Modal */}
        {showClientPositionsModal && selectedClient && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-xl p-6 max-w-6xl w-full border border-slate-700 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-800 pb-4 border-b border-slate-700">
                <div>
                  <h3 className="text-2xl font-bold">{selectedClient.name}'s Open Positions</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Account: {selectedClient.account} • Total P&L: 
                    <span className={`ml-1 font-semibold ${selectedClient.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${selectedClient.totalProfit.toFixed(2)}
                    </span>
                  </p>
                </div>
                <button 
                  onClick={() => setShowClientPositionsModal(false)} 
                  className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Account Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-xs text-slate-400 mb-1">Balance</div>
                  <div className="text-xl font-bold">${selectedClient.balance.toLocaleString()}</div>
                </div>
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                  <div className="text-xs text-slate-400 mb-1">Equity</div>
                  <div className="text-xl font-bold text-blue-400">${selectedClient.equity.toLocaleString()}</div>
                </div>
                <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg p-4">
                  <div className="text-xs text-slate-400 mb-1">Free Margin</div>
                  <div className="text-xl font-bold text-emerald-400">${selectedClient.freeMargin.toLocaleString()}</div>
                </div>
                <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                  <div className="text-xs text-slate-400 mb-1">Margin Level</div>
                  <div className="text-xl font-bold text-purple-400">{selectedClient.marginLevel}%</div>
                </div>
              </div>

              {/* Positions Table */}
              {clientPositions[selectedClient.id] && clientPositions[selectedClient.id].length > 0 ? (
                <div className="bg-slate-900/30 rounded-xl border border-slate-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr className="text-left text-sm text-slate-400">
                        <th className="p-4">Position ID</th>
                        <th className="p-4">Symbol</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Lots</th>
                        <th className="p-4">Open Price</th>
                        <th className="p-4">Current Price</th>
                        <th className="p-4">SL / TP</th>
                        <th className="p-4">Profit/Loss</th>
                        <th className="p-4">Open Time</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {clientPositions[selectedClient.id].map(position => (
                        <tr key={position.id} className="hover:bg-slate-700/30 text-sm">
                          <td className="p-4 font-mono text-blue-400">{position.id}</td>
                          <td className="p-4 font-bold">{position.symbol}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              position.type === 'BUY' 
                                ? 'bg-blue-600/20 text-blue-400' 
                                : 'bg-red-600/20 text-red-400'
                            }`}>
                              {position.type}
                            </span>
                          </td>
                          <td className="p-4">{position.lots}</td>
                          <td className="p-4 font-mono">{position.openPrice.toFixed(position.symbol === 'XAUUSD' || position.symbol === 'BTCUSD' ? 2 : 5)}</td>
                          <td className="p-4 font-mono font-bold">
                            {position.currentPrice.toFixed(position.symbol === 'XAUUSD' || position.symbol === 'BTCUSD' ? 2 : 5)}
                          </td>
                          <td className="p-4 text-xs">
                            <div className="text-amber-400">SL: {position.sl.toFixed(position.symbol === 'XAUUSD' || position.symbol === 'BTCUSD' ? 2 : 5)}</div>
                            <div className="text-emerald-400">TP: {position.tp.toFixed(position.symbol === 'XAUUSD' || position.symbol === 'BTCUSD' ? 2 : 5)}</div>
                          </td>
                          <td className="p-4">
                            <span className={`font-bold ${position.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              ${position.profit.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">{position.openTime}</td>
                          <td className="p-4">
                            <button 
                              onClick={() => handleCloseClientPosition(position.id)}
                              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1"
                            >
                              <X size={16} />
                              <span>Close</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-900/30 rounded-xl border border-slate-700 p-12 text-center">
                  <Activity size={48} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg">No open positions</p>
                  <p className="text-slate-500 text-sm mt-2">This client currently has no active trades</p>
                </div>
              )}

              <div className="mt-6 bg-amber-600/10 border border-amber-600/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-300">
                    <strong className="text-amber-400">Admin Action:</strong> Closing positions will immediately realize profit/loss. 
                    Use this carefully and only when necessary (margin call, emergency, etc.). All actions are logged.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Manager Wallet Modals (to be added before ManagerDashboard closing)
// These modals need to be added inside ManagerDashboard return statement

// ==================== CLIENT DASHBOARD ====================
const ClientDashboard = ({ user, branch, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [tradeForm, setTradeForm] = useState({ symbol: 'EURUSD', type: 'BUY', orderType: 'MARKET', lots: '0.1', sl: '', tp: '', limitPrice: '', stopPrice: '' });
  const [pendingOrders, setPendingOrders] = useState([]);
  
  // Charts tab states
  const [selectedChartSymbol, setSelectedChartSymbol] = useState('EURUSD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');

  // Wallet states
  const [walletBalance, setWalletBalance] = useState(10000);
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 1, date: '2024-11-15 10:30', type: 'deposit', amount: 5000, description: 'Initial deposit', status: 'completed' },
    { id: 2, date: '2024-11-16 14:20', type: 'deposit', amount: 5000, description: 'Additional funds', status: 'completed' },
    { id: 3, date: '2024-11-17 09:15', type: 'withdrawal', amount: 2000, description: 'Profit withdrawal', status: 'completed' },
    { id: 4, date: '2024-11-18 16:45', type: 'deposit', amount: 2000, description: 'Account funding', status: 'completed' }
  ]);
  const [walletDepositAmount, setWalletDepositAmount] = useState('');
  const [walletWithdrawAmount, setWalletWithdrawAmount] = useState('');
  const [showWalletDepositModal, setShowWalletDepositModal] = useState(false);
  const [showWalletWithdrawModal, setShowWalletWithdrawModal] = useState(false);

  // Live market prices with bid/ask spread
  const [marketPrices, setMarketPrices] = useState({
    EURUSD: { bid: 1.09485, ask: 1.09495, spread: 1.0 },
    GBPUSD: { bid: 1.26475, ask: 1.26488, spread: 1.3 },
    USDJPY: { bid: 149.825, ask: 149.845, spread: 2.0 },
    XAUUSD: { bid: 2658.20, ask: 2658.80, spread: 6.0 },
    BTCUSD: { bid: 91250.00, ask: 91280.00, spread: 30.0 }
  });

  // Simulate live price updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices(prev => {
        const updated = {};
        Object.keys(prev).forEach(symbol => {
          const change = (Math.random() - 0.5) * 0.0002;
          const newBid = prev[symbol].bid + change;
          const newAsk = newBid + (prev[symbol].spread / 10000);
          updated[symbol] = {
            bid: parseFloat(newBid.toFixed(symbol === 'XAUUSD' ? 2 : symbol === 'BTCUSD' ? 2 : 5)),
            ask: parseFloat(newAsk.toFixed(symbol === 'XAUUSD' ? 2 : symbol === 'BTCUSD' ? 2 : 5)),
            spread: prev[symbol].spread
          };
        });
        return updated;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const [accountData, setAccountData] = useState({
    balance: 50000,
    equity: 52500,
    freeMargin: 47500,
    marginLevel: 1050,
    unrealizedPL: 2500
  });

  const [positions, setPositions] = useState([
    { id: 1, symbol: 'EURUSD', type: 'BUY', lots: 0.1, openPrice: 1.09450, currentPrice: 1.09650, profit: 200 },
    { id: 2, symbol: 'XAUUSD', type: 'SELL', lots: 0.05, openPrice: 2665.80, currentPrice: 2658.40, profit: 370 },
    { id: 3, symbol: 'GBPUSD', type: 'BUY', lots: 0.15, openPrice: 1.26350, currentPrice: 1.26480, profit: 195 }
  ]);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    setAccountData({...accountData, balance: accountData.balance + amount});
    setDepositAmount('');
    setShowDepositModal(false);
    alert(`✅ Deposit of $${amount} submitted!`);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) { alert('Invalid amount'); return; }
    if (amount > accountData.balance) { alert('Insufficient balance'); return; }
    setAccountData({...accountData, balance: accountData.balance - amount});
    setWithdrawAmount('');
    setShowWithdrawModal(false);
    alert(`✅ Withdrawal of $${amount} submitted!`);
  };

  const handleTrade = () => {
    if (!tradeForm.lots || parseFloat(tradeForm.lots) <= 0) { alert('Invalid lot size'); return; }
    
    // Standard Account Restriction: Can only SELL if they have an open BUY position to close
    if (user.accountType === 'standard' && tradeForm.type === 'SELL') {
      const hasOpenBuyPosition = positions.some(p => p.symbol === tradeForm.symbol && p.type === 'BUY');
      if (!hasOpenBuyPosition) {
        alert('🚫 Standard Account Restriction\n\nStandard accounts can only SELL to close an existing BUY position.\n\nYou must first BUY this symbol before you can SELL it.\n\nUpgrade to a Business account for direct selling capability.');
        return;
      }
    }
    
    const price = marketPrices[tradeForm.symbol];
    
    // Handle Market Orders
    if (tradeForm.orderType === 'MARKET') {
      const executionPrice = tradeForm.type === 'BUY' ? price.ask : price.bid;
      
      const confirmMessage = `Confirm ${tradeForm.type} Order\n\n` +
        `Symbol: ${tradeForm.symbol}\n` +
        `Type: MARKET ${tradeForm.type}\n` +
        `Price: ${executionPrice}\n` +
        `Volume: ${tradeForm.lots} lots\n\n` +
        `Do you want to execute this order?`;
      
      if (!window.confirm(confirmMessage)) return;
      
      const newPosition = {
        id: Date.now(),
        symbol: tradeForm.symbol,
        type: tradeForm.type,
        lots: parseFloat(tradeForm.lots),
        openPrice: executionPrice,
        currentPrice: executionPrice,
        profit: 0
      };
      setPositions([...positions, newPosition]);
      setTradeForm({ symbol: 'EURUSD', type: 'BUY', orderType: 'MARKET', lots: '0.1', sl: '', tp: '', limitPrice: '', stopPrice: '' });
      setShowTradeModal(false);
      alert(`✅ MARKET ${tradeForm.type} order executed at ${executionPrice}!`);
    } 
    // Handle Pending Orders (Buy Limit, Sell Limit, Buy Stop, Sell Stop)
    else {
      let triggerPrice;
      if (tradeForm.orderType === 'BUY_LIMIT' || tradeForm.orderType === 'SELL_LIMIT') {
        triggerPrice = parseFloat(tradeForm.limitPrice);
      } else {
        triggerPrice = parseFloat(tradeForm.stopPrice);
      }
      
      if (!triggerPrice || triggerPrice <= 0) {
        alert('Please enter a valid trigger price');
        return;
      }

      // Auto-set direction based on order type
      const orderDirection = tradeForm.orderType.startsWith('BUY') ? 'BUY' : 'SELL';
      
      // Validate price levels
      const currentPrice = orderDirection === 'BUY' ? price.ask : price.bid;
      if (tradeForm.orderType === 'BUY_LIMIT' && triggerPrice >= currentPrice) {
        alert('Buy Limit price must be BELOW current market price');
        return;
      }
      if (tradeForm.orderType === 'SELL_LIMIT' && triggerPrice <= currentPrice) {
        alert('Sell Limit price must be ABOVE current market price');
        return;
      }
      if (tradeForm.orderType === 'BUY_STOP' && triggerPrice <= currentPrice) {
        alert('Buy Stop price must be ABOVE current market price');
        return;
      }
      if (tradeForm.orderType === 'SELL_STOP' && triggerPrice >= currentPrice) {
        alert('Sell Stop price must be BELOW current market price');
        return;
      }
      
      const confirmMessage = `Confirm Pending Order\n\n` +
        `Symbol: ${tradeForm.symbol}\n` +
        `Order Type: ${tradeForm.orderType.replace('_', ' ')}\n` +
        `Direction: ${orderDirection}\n` +
        `Trigger Price: ${triggerPrice}\n` +
        `Current Price: ${currentPrice}\n` +
        `Volume: ${tradeForm.lots} lots\n` +
        (tradeForm.sl ? `Stop Loss: ${tradeForm.sl}\n` : '') +
        (tradeForm.tp ? `Take Profit: ${tradeForm.tp}\n` : '') +
        `\nPlace this pending order?`;
      
      if (!window.confirm(confirmMessage)) return;
      
      const newPendingOrder = {
        id: Date.now(),
        symbol: tradeForm.symbol,
        type: orderDirection,
        orderType: tradeForm.orderType,
        lots: parseFloat(tradeForm.lots),
        triggerPrice: triggerPrice,
        sl: tradeForm.sl ? parseFloat(tradeForm.sl) : null,
        tp: tradeForm.tp ? parseFloat(tradeForm.tp) : null,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      
      setPendingOrders([...pendingOrders, newPendingOrder]);
      setTradeForm({ symbol: 'EURUSD', type: 'BUY', orderType: 'MARKET', lots: '0.1', sl: '', tp: '', limitPrice: '', stopPrice: '' });
      setShowTradeModal(false);
      alert(`✅ Pending ${tradeForm.orderType.replace('_', ' ')} order placed!\nTrigger: ${triggerPrice} | Current: ${currentPrice}`);
    }
  };

  const handleCancelPendingOrder = (id) => {
    if (window.confirm('Cancel this pending order?')) {
      setPendingOrders(pendingOrders.filter(order => order.id !== id));
      alert('✅ Pending order cancelled');
    }
  };

  const handleClosePosition = (id) => {
    if (window.confirm('Close this position?')) {
      const position = positions.find(p => p.id === id);
      setAccountData({...accountData, balance: accountData.balance + position.profit, unrealizedPL: accountData.unrealizedPL - position.profit});
      setPositions(positions.filter(p => p.id !== id));
      alert(`✅ Position closed. Profit: $${position.profit}`);
    }
  };

  const handleWalletDeposit = () => {
    const amount = parseFloat(walletDepositAmount);
    if (!amount || amount <= 0) {
      alert('❌ Please enter a valid amount');
      return;
    }
    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      type: 'deposit',
      amount: amount,
      description: 'Wallet deposit',
      status: 'completed'
    };
    setWalletBalance(walletBalance + amount);
    setWalletTransactions([newTransaction, ...walletTransactions]);
    setWalletDepositAmount('');
    setShowWalletDepositModal(false);
    alert(`✅ Deposit of $${amount.toLocaleString()} completed!`);
  };

  const handleWalletWithdraw = () => {
    const amount = parseFloat(walletWithdrawAmount);
    if (!amount || amount <= 0) {
      alert('❌ Please enter a valid amount');
      return;
    }
    if (amount > walletBalance) {
      alert('❌ Insufficient wallet balance');
      return;
    }
    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      type: 'withdrawal',
      amount: amount,
      description: 'Wallet withdrawal',
      status: 'completed'
    };
    setWalletBalance(walletBalance - amount);
    setWalletTransactions([newTransaction, ...walletTransactions]);
    setWalletWithdrawAmount('');
    setShowWalletWithdrawModal(false);
    alert(`✅ Withdrawal of $${amount.toLocaleString()} completed!`);
  };

  const handleTransferToTrading = () => {
    const amount = parseFloat(walletWithdrawAmount);
    if (!amount || amount <= 0) {
      alert('❌ Please enter a valid amount');
      return;
    }
    if (amount > walletBalance) {
      alert('❌ Insufficient wallet balance');
      return;
    }
    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      type: 'transfer',
      amount: amount,
      description: 'Transfer to trading account',
      status: 'completed'
    };
    setWalletBalance(walletBalance - amount);
    setAccountData({...accountData, balance: accountData.balance + amount});
    setWalletTransactions([newTransaction, ...walletTransactions]);
    setWalletWithdrawAmount('');
    alert(`✅ Transferred $${amount.toLocaleString()} to trading account!`);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="w-72 bg-slate-800/50 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          {branch?.logo ? (
            <div className="flex items-center gap-3">
              <img src={branch.logo} alt={branch.name} className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
              <div>
                <div className="text-lg font-bold text-emerald-400">{branch.name}</div>
                <div className="text-xs text-slate-400">{branch.code}</div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold text-emerald-400">{branch?.name || 'Trading Platform'}</div>
              {branch?.code && <div className="text-sm text-slate-400">{branch.code}</div>}
            </div>
          )}
        </div>
        <div className="p-4 border-b border-slate-700">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Balance</span>
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
            <div className="text-2xl font-bold">{showBalance ? `$${accountData.balance.toLocaleString()}` : '••••••'}</div>
            <div className="text-sm text-emerald-400">+${showBalance ? accountData.unrealizedPL.toLocaleString() : '•••'}</div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {['overview', 'positions', 'charts', 'wallet', 'history'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full px-4 py-3 rounded-lg text-left ${activeTab === tab ? 'bg-emerald-600' : 'bg-slate-700'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="text-sm font-semibold">{user.name}</div>
          <div className="text-xs text-slate-400">{user.accountNumber}</div>
          <button onClick={onLogout} className="text-red-400 text-sm mt-2">Logout</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-slate-800/30 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Trading Dashboard</h1>
              <p className="text-slate-400">Welcome back, {user.name}</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowDepositModal(true)} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                <Download size={20} />
                <span>Deposit</span>
              </button>
              <button onClick={() => setShowWithdrawModal(true)} className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                <Upload size={20} />
                <span>Withdraw</span>
              </button>
              <button onClick={() => setShowTradeModal(true)} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                <Plus size={20} />
                <span>Trade</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Balance</span>
                    <DollarSign className="text-emerald-400" size={24} />
                  </div>
                  <div className="text-3xl font-bold">${accountData.balance.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Equity</span>
                    <TrendingUp className="text-blue-400" size={24} />
                  </div>
                  <div className="text-3xl font-bold">${accountData.equity.toLocaleString()}</div>
                  <div className="text-xs text-emerald-500">+5.0%</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Free Margin</span>
                    <Activity className="text-purple-400" size={24} />
                  </div>
                  <div className="text-3xl font-bold">${accountData.freeMargin.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Margin Level</span>
                    <BarChart3 className="text-amber-400" size={24} />
                  </div>
                  <div className="text-3xl font-bold">{accountData.marginLevel}%</div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold mb-4">Open Positions</h3>
                <div className="space-y-3">
                  {positions.map(pos => (
                    <div key={pos.id} className="bg-slate-900/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${pos.type === 'BUY' ? 'bg-blue-600/20 text-blue-400' : 'bg-red-600/20 text-red-400'}`}>
                          {pos.type === 'BUY' ? '↑' : '↓'}
                        </div>
                        <div>
                          <div className="font-semibold">{pos.symbol}</div>
                          <div className="text-sm text-slate-400">{pos.lots} lots @ {pos.openPrice}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${pos.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            +${pos.profit}
                          </div>
                          <div className="text-xs text-slate-400">{pos.currentPrice}</div>
                        </div>
                        <button onClick={() => handleClosePosition(pos.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold">Close</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold mb-4">Performance Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Deposits</span>
                      <span className="font-semibold text-emerald-400">$50,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Withdrawals</span>
                      <span className="font-semibold">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Profit</span>
                      <span className="font-semibold text-emerald-400">+$2,500</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-700">
                      <span className="text-slate-400">ROI</span>
                      <span className="text-2xl font-bold text-emerald-400">+5.0%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold transition-colors">
                      Deposit Funds
                    </button>
                    <button className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold transition-colors">
                      Withdraw Funds
                    </button>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors">
                      New Trade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'positions' && (
            <div className="space-y-6">
              {/* Open Positions */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Open Positions ({positions.length})</h2>
                {positions.length > 0 ? (
                  <div className="space-y-3">
                    {positions.map(pos => (
                      <div key={pos.id} className="bg-slate-900/50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${pos.type === 'BUY' ? 'bg-blue-600/20 text-blue-400' : 'bg-red-600/20 text-red-400'}`}>
                            {pos.type === 'BUY' ? '↑' : '↓'}
                          </div>
                          <div>
                            <div className="font-semibold">{pos.symbol}</div>
                            <div className="text-sm text-slate-400">{pos.lots} lots @ {pos.openPrice}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${pos.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {pos.profit >= 0 ? '+' : ''}${pos.profit}
                            </div>
                            <div className="text-xs text-slate-400">{pos.currentPrice}</div>
                          </div>
                          <button onClick={() => handleClosePosition(pos.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold">Close</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No open positions</p>
                )}
              </div>

              {/* Pending Orders */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Pending Orders ({pendingOrders.length})</h2>
                {pendingOrders.length > 0 ? (
                  <div className="space-y-3">
                    {pendingOrders.map(order => (
                      <div key={order.id} className="bg-slate-900/50 rounded-lg p-4 flex items-center justify-between border-l-4 border-amber-500">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold bg-amber-600/20 text-amber-400">
                            <Clock size={24} />
                          </div>
                          <div>
                            <div className="font-semibold">{order.symbol}</div>
                            <div className="text-sm text-slate-400">
                              {order.orderType.replace('_', ' ')} - {order.lots} lots
                            </div>
                            <div className="text-xs text-amber-400 mt-1">
                              Trigger @ {order.triggerPrice}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-600/20 text-amber-400">
                              {order.status}
                            </span>
                            <div className="text-xs text-slate-400 mt-1">
                              {order.type}
                            </div>
                          </div>
                          <button onClick={() => handleCancelPendingOrder(order.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No pending orders</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Technical Analysis & Charts</h2>
                <div className="flex space-x-3">
                  <select 
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold"
                    value={selectedChartSymbol}
                    onChange={(e) => setSelectedChartSymbol(e.target.value)}
                  >
                    <option value="EURUSD">EURUSD</option>
                    <option value="GBPUSD">GBPUSD</option>
                    <option value="USDJPY">USDJPY</option>
                    <option value="XAUUSD">XAUUSD</option>
                    <option value="BTCUSD">BTCUSD</option>
                  </select>
                  <select 
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-semibold"
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                  >
                    <option value="1M">1 Minute</option>
                    <option value="5M">5 Minutes</option>
                    <option value="15M">15 Minutes</option>
                    <option value="1H">1 Hour</option>
                    <option value="4H">4 Hours</option>
                    <option value="1D">1 Day</option>
                  </select>
                </div>
              </div>

              {/* Live Price Card */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400 mb-2">Current Price - {selectedChartSymbol}</div>
                    <div className="flex items-center space-x-6">
                      <div>
                        <div className="text-xs text-slate-400">BID</div>
                        <div className="text-3xl font-bold text-red-400">
                          {marketPrices[selectedChartSymbol]?.bid.toFixed(selectedChartSymbol === 'XAUUSD' || selectedChartSymbol === 'BTCUSD' ? 2 : 5)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">ASK</div>
                        <div className="text-3xl font-bold text-blue-400">
                          {marketPrices[selectedChartSymbol]?.ask.toFixed(selectedChartSymbol === 'XAUUSD' || selectedChartSymbol === 'BTCUSD' ? 2 : 5)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">SPREAD</div>
                        <div className="text-xl font-bold text-amber-400">
                          {marketPrices[selectedChartSymbol]?.spread.toFixed(1)} pips
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-emerald-400">Live</span>
                  </div>
                </div>
              </div>

              {/* Technical Indicators */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-2">RSI (14)</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {(() => {
                      const rsi = 45 + Math.random() * 20;
                      return rsi.toFixed(1);
                    })()}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Neutral</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-2">MACD</div>
                  <div className="text-2xl font-bold text-emerald-400">+0.0012</div>
                  <div className="text-xs text-emerald-400 mt-1">Bullish</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-2">MA (50)</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {(marketPrices[selectedChartSymbol]?.bid * 0.999).toFixed(selectedChartSymbol === 'XAUUSD' || selectedChartSymbol === 'BTCUSD' ? 2 : 5)}
                  </div>
                  <div className="text-xs text-blue-400 mt-1">Above MA</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-2">Bollinger Bands</div>
                  <div className="text-2xl font-bold text-amber-400">Mid</div>
                  <div className="text-xs text-slate-500 mt-1">Normal Range</div>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{selectedChartSymbol} - {selectedTimeframe} Chart</h3>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 rounded text-xs font-semibold">Candlestick</button>
                      <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-semibold">Line</button>
                      <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-semibold">Area</button>
                    </div>
                  </div>
                </div>
                
                {/* Simulated Chart Area */}
                <div className="p-6 bg-slate-900/30">
                  <div className="h-96 flex items-end space-x-1">
                    {Array.from({ length: 50 }).map((_, i) => {
                      const height = 30 + Math.random() * 60;
                      const isGreen = Math.random() > 0.5;
                      return (
                        <div key={i} className="flex-1 flex flex-col justify-end">
                          <div 
                            className={`w-full rounded-t transition-all ${isGreen ? 'bg-emerald-600/60 hover:bg-emerald-600' : 'bg-red-600/60 hover:bg-red-600'}`}
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 grid grid-cols-10 text-xs text-slate-500 text-center">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i}>-{10-i}h</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Market Analysis */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold mb-4">Support & Resistance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">R3:</span>
                      <span className="font-mono font-bold text-red-400">
                        {(marketPrices[selectedChartSymbol]?.ask * 1.015).toFixed(selectedChartSymbol === 'XAUUSD' || selectedChartSymbol === 'BTCUSD' ? 2 : 5)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">R2:</span>
                      <span className="font-mono font-bold text-red-300">
                        {(marketPrices[selectedChartSymbol]?.ask * 1.010).toFixed(selectedChartSymbol === 'XAUUSD' || selectedChartSymbol === 'BTCUSD' ? 2 : 5)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">R1:</span>
                      <span className="font-mono font-bold text-red-200">
                        {(marketPrices[selectedChartSymbol]?.ask * 1.005).toFixed(selectedChartSymbol === 'XAUUSD' || selectedChartSymbol === 'BTCUSD' ? 2 : 5)}
                      </span>
                    </div>
                    <div className="h-px bg-amber-500"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">S1:</span>
                      <span className="font-mono font-bold text-emerald-200">
                        {(marketPrices[selectedChartSymbol]?.bid * 0.995).toFixed(selectedChartSymbol === 'XAUUSD' || selectedChartSymbol === 'BTCUSD' ? 2 : 5)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">S2:</span>
                      <span className="font-mono font-bold text-emerald-300">
                        {(marketPrices[selectedChartSymbol]?.bid * 0.990).toFixed(selectedChartSymbol === 'XAUUSD' || selectedChartSymbol === 'BTCUSD' ? 2 : 5)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">S3:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {(marketPrices[selectedChartSymbol]?.bid * 0.985).toFixed(selectedChartSymbol === 'XAUUSD' || selectedChartSymbol === 'BTCUSD' ? 2 : 5)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold mb-4">Technical Signals</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-600/10 border border-emerald-600/30 rounded-lg">
                      <div>
                        <div className="font-semibold text-emerald-400">Moving Average</div>
                        <div className="text-xs text-slate-400">50/200 Cross</div>
                      </div>
                      <div className="text-2xl font-bold text-emerald-400">BUY</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <div className="font-semibold">RSI Indicator</div>
                        <div className="text-xs text-slate-400">Relative Strength</div>
                      </div>
                      <div className="text-2xl font-bold text-slate-400">NEUTRAL</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-400">Volume Analysis</div>
                        <div className="text-xs text-slate-400">Above Average</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-400">STRONG</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pattern Recognition */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold mb-4">Detected Chart Patterns</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                    <div className="text-sm text-slate-400">Pattern Type</div>
                    <div className="text-lg font-bold text-blue-400 mt-1">Bull Flag</div>
                    <div className="text-xs text-slate-500 mt-2">Continuation Pattern</div>
                  </div>
                  <div className="p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
                    <div className="text-sm text-slate-400">Trend Direction</div>
                    <div className="text-lg font-bold text-purple-400 mt-1">Uptrend</div>
                    <div className="text-xs text-slate-500 mt-2">Higher Highs & Lows</div>
                  </div>
                  <div className="p-4 bg-amber-600/10 border border-amber-600/30 rounded-lg">
                    <div className="text-sm text-slate-400">Confidence Level</div>
                    <div className="text-lg font-bold text-amber-400 mt-1">78%</div>
                    <div className="text-xs text-slate-500 mt-2">High Probability</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Wallet Management</h2>
                <div className="flex space-x-3">
                  <button onClick={() => setShowWalletDepositModal(true)} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                    <Download size={20} />
                    <span>Deposit</span>
                  </button>
                  <button onClick={() => setShowWalletWithdrawModal(true)} className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2">
                    <Upload size={20} />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>

              {/* Wallet Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-600/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Wallet Balance</span>
                    <DollarSign className="text-emerald-400" size={24} />
                  </div>
                  <div className="text-4xl font-bold text-emerald-400">${walletBalance.toLocaleString()}</div>
                  <div className="text-xs text-slate-400 mt-2">Available for withdrawal</div>
                </div>

                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Trading Account</span>
                    <Activity className="text-blue-400" size={24} />
                  </div>
                  <div className="text-4xl font-bold text-blue-400">${accountData.balance.toLocaleString()}</div>
                  <div className="text-xs text-slate-400 mt-2">Active trading balance</div>
                </div>

                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-600/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Total Assets</span>
                    <BarChart3 className="text-purple-400" size={24} />
                  </div>
                  <div className="text-4xl font-bold text-purple-400">${(walletBalance + accountData.balance).toLocaleString()}</div>
                  <div className="text-xs text-slate-400 mt-2">Combined balance</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold mb-4">Quick Transfer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-3">Transfer from Wallet to Trading Account</div>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        value={walletWithdrawAmount}
                        onChange={(e) => setWalletWithdrawAmount(e.target.value)}
                      />
                      <button onClick={handleTransferToTrading} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold">
                        Transfer
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">Available: ${walletBalance.toLocaleString()}</div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-3">Wallet Information</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Deposits:</span>
                        <span className="font-semibold text-emerald-400">
                          ${walletTransactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Withdrawals:</span>
                        <span className="font-semibold text-amber-400">
                          ${walletTransactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transactions:</span>
                        <span className="font-semibold">{walletTransactions.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                  <h3 className="text-lg font-bold">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-900/30">
                        <th className="text-left py-4 px-6 text-slate-400 text-sm">Date & Time</th>
                        <th className="text-left py-4 px-6 text-slate-400 text-sm">Type</th>
                        <th className="text-left py-4 px-6 text-slate-400 text-sm">Amount</th>
                        <th className="text-left py-4 px-6 text-slate-400 text-sm">Description</th>
                        <th className="text-left py-4 px-6 text-slate-400 text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-8 px-6 text-center text-slate-400">
                            No transactions yet
                          </td>
                        </tr>
                      ) : (
                        walletTransactions.map(transaction => (
                          <tr key={transaction.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="py-4 px-6 text-sm">{transaction.date}</td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                transaction.type === 'deposit' ? 'bg-emerald-600/20 text-emerald-400' :
                                transaction.type === 'withdrawal' ? 'bg-amber-600/20 text-amber-400' :
                                'bg-blue-600/20 text-blue-400'
                              }`}>
                                {transaction.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`font-semibold ${
                                transaction.type === 'deposit' ? 'text-emerald-400' : 
                                transaction.type === 'withdrawal' ? 'text-amber-400' : 
                                'text-blue-400'
                              }`}>
                                {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-300">{transaction.description}</td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/20 text-emerald-400">
                                {transaction.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Trade History</h2>
              <p className="text-slate-400">View your past trades and performance</p>
            </div>
          )}
        </div>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Deposit Funds</h3>
                <button onClick={() => setShowDepositModal(false)}><X size={24} /></button>
              </div>
              <input type="number" placeholder="Amount" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white mb-4" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
              <button onClick={handleDeposit} className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold">Submit Deposit</button>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Withdraw Funds</h3>
                <button onClick={() => setShowWithdrawModal(false)}><X size={24} /></button>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                <div className="text-sm text-slate-400">Available Balance</div>
                <div className="text-2xl font-bold">${accountData.balance.toLocaleString()}</div>
              </div>
              <input type="number" placeholder="Amount" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white mb-4" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
              <button onClick={handleWithdraw} className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold">Submit Withdrawal</button>
            </div>
          </div>
        )}

        {/* Wallet Deposit Modal */}
        {showWalletDepositModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Deposit to Wallet</h3>
                <button onClick={() => setShowWalletDepositModal(false)}><X size={24} /></button>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                <div className="text-sm text-slate-400">Current Wallet Balance</div>
                <div className="text-2xl font-bold text-emerald-400">${walletBalance.toLocaleString()}</div>
              </div>
              <div className="mb-4">
                <label className="text-sm text-slate-400 mb-2 block">Deposit Amount</label>
                <input 
                  type="number" 
                  placeholder="Enter amount" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" 
                  value={walletDepositAmount} 
                  onChange={(e) => setWalletDepositAmount(e.target.value)} 
                />
              </div>
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3 mb-4">
                <div className="text-xs text-slate-300">
                  💡 <strong>Note:</strong> Deposits are instant and will be reflected immediately in your wallet balance.
                </div>
              </div>
              <button onClick={handleWalletDeposit} className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold">
                Confirm Deposit
              </button>
            </div>
          </div>
        )}

        {/* Wallet Withdraw Modal */}
        {showWalletWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Withdraw from Wallet</h3>
                <button onClick={() => setShowWalletWithdrawModal(false)}><X size={24} /></button>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                <div className="text-sm text-slate-400">Available Wallet Balance</div>
                <div className="text-2xl font-bold text-emerald-400">${walletBalance.toLocaleString()}</div>
              </div>
              <div className="mb-4">
                <label className="text-sm text-slate-400 mb-2 block">Withdrawal Amount</label>
                <input 
                  type="number" 
                  placeholder="Enter amount" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" 
                  value={walletWithdrawAmount} 
                  onChange={(e) => setWalletWithdrawAmount(e.target.value)} 
                />
              </div>
              <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-3 mb-4">
                <div className="text-xs text-slate-300">
                  ⚠️ <strong>Important:</strong> Withdrawals are processed instantly. Ensure you have sufficient balance.
                </div>
              </div>
              <button onClick={handleWalletWithdraw} className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold">
                Confirm Withdrawal
              </button>
            </div>
          </div>
        )}

        {/* Trade Modal */}
        {showTradeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto\">
            <div className="bg-slate-800 rounded-xl p-6 max-w-lg w-full border border-slate-700 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">New Trade</h3>
                <button onClick={() => setShowTradeModal(false)}><X size={24} /></button>
              </div>

              {/* Account Type Restriction Notice for Standard Accounts */}
              {user.accountType === 'standard' && (
                <div className="mb-4 bg-amber-600/10 border border-amber-600/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-amber-400 text-2xl">⚠️</div>
                    <div>
                      <div className="text-sm font-semibold text-amber-400 mb-1">Standard Account Trading Rules</div>
                      <div className="text-xs text-slate-300">
                        • You can <span className="text-blue-400 font-semibold">BUY</span> any symbol at any time<br/>
                        • You can only <span className="text-red-400 font-semibold">SELL</span> to close an existing BUY position<br/>
                        • Direct selling requires a Business account
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Symbol Selection */}
              <div className="space-y-4">
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-semibold" value={tradeForm.symbol} onChange={(e) => setTradeForm({...tradeForm, symbol: e.target.value})}>
                  <option value="EURUSD">EURUSD - Euro vs US Dollar</option>
                  <option value="GBPUSD">GBPUSD - British Pound vs US Dollar</option>
                  <option value="USDJPY">USDJPY - US Dollar vs Japanese Yen</option>
                  <option value="XAUUSD">XAUUSD - Gold vs US Dollar</option>
                  <option value="BTCUSD">BTCUSD - Bitcoin vs US Dollar</option>
                </select>

                {/* Order Type Selection */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Order Type</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-semibold" value={tradeForm.orderType} onChange={(e) => setTradeForm({...tradeForm, orderType: e.target.value})}>
                    <option value="MARKET">Market Order (Execute Immediately at Current Price)</option>
                    <optgroup label="Pending Orders - Buy">
                      <option value="BUY_LIMIT">Buy Limit (Place buy order below current price)</option>
                      <option value="BUY_STOP">Buy Stop (Place buy order above current price)</option>
                    </optgroup>
                    <optgroup label="Pending Orders - Sell">
                      <option value="SELL_LIMIT">Sell Limit (Place sell order above current price)</option>
                      <option value="SELL_STOP">Sell Stop (Place sell order below current price)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Info about selected order type */}
                {tradeForm.orderType !== 'MARKET' && (
                  <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                    <div className="text-xs text-slate-300">
                      {tradeForm.orderType === 'BUY_LIMIT' && '📊 Buy Limit: Order will execute when price drops to your specified level (good for buying at lower price)'}
                      {tradeForm.orderType === 'SELL_LIMIT' && '📊 Sell Limit: Order will execute when price rises to your specified level (good for selling at higher price)'}
                      {tradeForm.orderType === 'BUY_STOP' && '📊 Buy Stop: Order will execute when price breaks above your specified level (good for breakout trading)'}
                      {tradeForm.orderType === 'SELL_STOP' && '📊 Sell Stop: Order will execute when price breaks below your specified level (good for breakdown trading)'}
                    </div>
                  </div>
                )}

                {/* Live Price Display - Only for Market Orders */}
                {tradeForm.orderType === 'MARKET' && (
                  <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-slate-300">Live Market Price</div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-400">Live</span>
                      </div>
                    </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* BID Price */}
                    <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">SELL (BID)</div>
                      <div className="text-2xl font-bold text-red-400">
                        {marketPrices[tradeForm.symbol].bid.toFixed(tradeForm.symbol === 'XAUUSD' || tradeForm.symbol === 'BTCUSD' ? 2 : 5)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Click SELL to trade at this price</div>
                    </div>

                    {/* ASK Price */}
                    <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">BUY (ASK)</div>
                      <div className="text-2xl font-bold text-blue-400">
                        {marketPrices[tradeForm.symbol].ask.toFixed(tradeForm.symbol === 'XAUUSD' || tradeForm.symbol === 'BTCUSD' ? 2 : 5)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Click BUY to trade at this price</div>
                    </div>
                  </div>

                  {/* Spread Info */}
                  <div className="mt-3 flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-slate-400">Spread</span>
                    <span className="text-sm font-semibold text-amber-400">{marketPrices[tradeForm.symbol].spread.toFixed(1)} pips</span>
                  </div>
                  </div>
                )}

                {/* Pending Order Price Input */}
                {tradeForm.orderType !== 'MARKET' && (
                  <div className="bg-amber-600/10 border border-amber-600/30 rounded-xl p-4">
                    <div className="text-sm font-semibold text-amber-400 mb-3">Pending Order Setup</div>
                    <div className="mb-3">
                      <label className="text-sm text-slate-400 mb-2 block">
                        {tradeForm.orderType === 'BUY_LIMIT' || tradeForm.orderType === 'SELL_LIMIT' ? 'Limit Price' : 'Stop Price'}
                      </label>
                      <input 
                        type="number" 
                        step="0.00001" 
                        placeholder={`Enter ${tradeForm.orderType.includes('LIMIT') ? 'limit' : 'stop'} price`}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-semibold" 
                        value={tradeForm.orderType.includes('LIMIT') ? tradeForm.limitPrice : tradeForm.stopPrice}
                        onChange={(e) => setTradeForm({...tradeForm, [tradeForm.orderType.includes('LIMIT') ? 'limitPrice' : 'stopPrice']: e.target.value})} 
                      />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400">Current Market Price</div>
                      <div className="text-lg font-bold text-white">
                        BID: {marketPrices[tradeForm.symbol].bid.toFixed(tradeForm.symbol === 'XAUUSD' || tradeForm.symbol === 'BTCUSD' ? 2 : 5)} | 
                        ASK: {marketPrices[tradeForm.symbol].ask.toFixed(tradeForm.symbol === 'XAUUSD' || tradeForm.symbol === 'BTCUSD' ? 2 : 5)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Direction Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setTradeForm({...tradeForm, type: 'BUY'})} className={`py-4 rounded-lg font-semibold transition-all ${tradeForm.type === 'BUY' ? 'bg-blue-600 scale-105' : 'bg-slate-700 hover:bg-slate-600'}`}>
                    <div className="text-lg">BUY</div>
                    {tradeForm.orderType === 'MARKET' && (
                      <div className="text-xs opacity-75">@ {marketPrices[tradeForm.symbol].ask.toFixed(tradeForm.symbol === 'XAUUSD' || tradeForm.symbol === 'BTCUSD' ? 2 : 5)}</div>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      if (user.accountType === 'standard') {
                        const hasOpenBuyPosition = positions.some(p => p.symbol === tradeForm.symbol && p.type === 'BUY');
                        if (!hasOpenBuyPosition) {
                          alert(`🚫 Cannot SELL ${tradeForm.symbol}\n\nStandard accounts must first BUY before selling.\n\nYou have no open BUY position for ${tradeForm.symbol}.`);
                          return;
                        }
                      }
                      setTradeForm({...tradeForm, type: 'SELL'});
                    }} 
                    disabled={user.accountType === 'standard' && !positions.some(p => p.symbol === tradeForm.symbol && p.type === 'BUY')}
                    className={`py-4 rounded-lg font-semibold transition-all ${
                      user.accountType === 'standard' && !positions.some(p => p.symbol === tradeForm.symbol && p.type === 'BUY')
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50' 
                        : tradeForm.type === 'SELL' 
                          ? 'bg-red-600 scale-105' 
                          : 'bg-slate-700 hover:bg-slate-600'
                    }`}>
                    <div className="text-lg">SELL</div>
                    {tradeForm.orderType === 'MARKET' && (
                      <div className="text-xs opacity-75">
                        {user.accountType === 'standard' && !positions.some(p => p.symbol === tradeForm.symbol && p.type === 'BUY') 
                          ? '(Buy first)' 
                          : `@ ${marketPrices[tradeForm.symbol].bid.toFixed(tradeForm.symbol === 'XAUUSD' || tradeForm.symbol === 'BTCUSD' ? 2 : 5)}`}
                      </div>
                    )}
                  </button>
                </div>

                {/* Lot Size */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Volume (Lots)</label>
                  <input type="number" step="0.01" placeholder="0.10" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-semibold" value={tradeForm.lots} onChange={(e) => setTradeForm({...tradeForm, lots: e.target.value})} />
                </div>

                {/* Stop Loss & Take Profit (Optional) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Stop Loss (Optional)</label>
                    <input type="number" step="0.00001" placeholder="SL Price" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={tradeForm.sl} onChange={(e) => setTradeForm({...tradeForm, sl: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Take Profit (Optional)</label>
                    <input type="number" step="0.00001" placeholder="TP Price" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white" value={tradeForm.tp} onChange={(e) => setTradeForm({...tradeForm, tp: e.target.value})} />
                  </div>
                </div>

                {/* Order Summary */}
                <div className={`${tradeForm.orderType === 'MARKET' ? 'bg-blue-600/10 border-blue-600/30' : 'bg-amber-600/10 border-amber-600/30'} border rounded-lg p-4`}>
                  <div className={`text-sm font-semibold mb-2 ${tradeForm.orderType === 'MARKET' ? 'text-blue-400' : 'text-amber-400'}`}>Order Summary</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order Type:</span>
                      <span className="font-semibold text-white">{tradeForm.orderType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Direction:</span>
                      <span className={`font-semibold ${tradeForm.type === 'BUY' ? 'text-blue-400' : 'text-red-400'}`}>{tradeForm.type}</span>
                    </div>
                    {tradeForm.orderType === 'MARKET' ? (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Execution Price:</span>
                        <span className="font-semibold text-white">
                          {(tradeForm.type === 'BUY' ? marketPrices[tradeForm.symbol].ask : marketPrices[tradeForm.symbol].bid).toFixed(tradeForm.symbol === 'XAUUSD' || tradeForm.symbol === 'BTCUSD' ? 2 : 5)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Trigger Price:</span>
                        <span className="font-semibold text-white">
                          {tradeForm.orderType.includes('LIMIT') ? (tradeForm.limitPrice || 'Not set') : (tradeForm.stopPrice || 'Not set')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Volume:</span>
                      <span className="font-semibold text-white">{tradeForm.lots || '0.00'} lots</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Execute Button */}
              <button onClick={handleTrade} className={`w-full py-4 rounded-lg font-bold text-lg mt-4 transition-all ${tradeForm.orderType === 'MARKET' ? (tradeForm.type === 'BUY' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700') : 'bg-amber-600 hover:bg-amber-700'}`}>
                {tradeForm.orderType === 'MARKET' ? `Execute ${tradeForm.type} Order` : `Place Pending Order`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImtiazTradingPlatform;


