import React, { useState } from 'react';
import { TrendingUp, Copy, CheckCircle, DollarSign, Activity, BarChart3, Clock, Download, Upload, Eye, EyeOff, Plus, X, AlertTriangle, Server, Globe, FileText, Key } from 'lucide-react';

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

export default AdminDashboard;
