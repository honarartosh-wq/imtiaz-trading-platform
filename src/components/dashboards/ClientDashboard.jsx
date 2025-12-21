import React, { useState } from 'react';
import { TrendingUp, Copy, CheckCircle, DollarSign, Activity, BarChart3, Clock, Download, Upload, Eye, EyeOff, Plus, X, AlertTriangle, Server, Globe, FileText, Key } from 'lucide-react';

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


export default ClientDashboard;
