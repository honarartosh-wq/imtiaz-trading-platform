import React, { useState } from 'react';
import { TrendingUp, Copy, CheckCircle, DollarSign, Activity, BarChart3, Clock, Download, Upload, Eye, EyeOff, Plus, X, AlertTriangle, Server, Globe, FileText, Key } from 'lucide-react';

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

export default ManagerDashboard;
