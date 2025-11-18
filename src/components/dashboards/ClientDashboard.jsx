import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  PieChart,
  LogOut,
  Settings,
  Bell,
  History,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Wallet
} from 'lucide-react';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const portfolio = {
    balance: user.balance || 50000,
    equity: 52350,
    margin: 5000,
    freeMargin: 47350,
    marginLevel: 1047,
    profit: 2350,
    profitPercent: 4.7
  };

  const positions = [
    { id: 1, pair: 'EUR/USD', type: 'Buy', lots: 0.5, entry: 1.0850, current: 1.0895, profit: 225, pips: 45 },
    { id: 2, pair: 'GBP/USD', type: 'Sell', lots: 0.3, entry: 1.2650, current: 1.2620, profit: 90, pips: 30 },
    { id: 3, pair: 'USD/JPY', type: 'Buy', lots: 0.2, entry: 149.50, current: 149.20, profit: -60, pips: -30 }
  ];

  const recentTransactions = [
    { id: 1, type: 'deposit', amount: 5000, status: 'completed', date: '2025-11-15' },
    { id: 2, type: 'withdrawal', amount: 2000, status: 'completed', date: '2025-11-10' },
    { id: 3, type: 'deposit', amount: 10000, status: 'completed', date: '2025-11-05' }
  ];

  const tradingPairs = [
    { pair: 'EUR/USD', bid: 1.0895, ask: 1.0897, change: '+0.12%', status: 'up' },
    { pair: 'GBP/USD', bid: 1.2620, ask: 1.2622, change: '-0.08%', status: 'down' },
    { pair: 'USD/JPY', bid: 149.20, ask: 149.22, change: '+0.25%', status: 'up' },
    { pair: 'AUD/USD', bid: 0.6525, ask: 0.6527, change: '+0.15%', status: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Trading Platform</h1>
              <p className="text-gray-400 text-sm">
                Welcome, {user.name} • Account: {user.accountNumber}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('trading')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'trading'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trading
              </div>
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'portfolio'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Portfolio
              </div>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Transactions
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Account Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-blue-100 text-sm">Balance</h3>
                  <Wallet className="text-blue-200 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">${portfolio.balance.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-green-100 text-sm">Equity</h3>
                  <DollarSign className="text-green-200 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">${portfolio.equity.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-purple-100 text-sm">Profit/Loss</h3>
                  {portfolio.profit >= 0 ? 
                    <TrendingUp className="text-purple-200 w-5 h-5" /> : 
                    <TrendingDown className="text-purple-200 w-5 h-5" />
                  }
                </div>
                <p className={`text-3xl font-bold ${portfolio.profit >= 0 ? 'text-white' : 'text-red-200'}`}>
                  {portfolio.profit >= 0 ? '+' : ''}{portfolio.profit.toLocaleString()}
                </p>
                <p className="text-purple-100 text-sm mt-1">
                  {portfolio.profitPercent >= 0 ? '+' : ''}{portfolio.profitPercent}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-orange-100 text-sm">Free Margin</h3>
                  <CreditCard className="text-orange-200 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">${portfolio.freeMargin.toLocaleString()}</p>
                <p className="text-orange-100 text-sm mt-1">
                  Margin Level: {portfolio.marginLevel}%
                </p>
              </div>
            </div>

            {/* Open Positions */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Open Positions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Pair</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Type</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Lots</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Entry</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Current</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Pips</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Profit</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map(pos => (
                      <tr key={pos.id} className="border-b border-gray-700">
                        <td className="py-3 text-white font-semibold">{pos.pair}</td>
                        <td className="py-3">
                          <span className={`flex items-center gap-1 ${
                            pos.type === 'Buy' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {pos.type === 'Buy' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {pos.type}
                          </span>
                        </td>
                        <td className="py-3 text-white">{pos.lots}</td>
                        <td className="py-3 text-gray-400">{pos.entry}</td>
                        <td className="py-3 text-white">{pos.current}</td>
                        <td className={`py-3 ${pos.pips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pos.pips >= 0 ? '+' : ''}{pos.pips}
                        </td>
                        <td className={`py-3 font-semibold ${pos.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pos.profit >= 0 ? '+' : ''}${pos.profit}
                        </td>
                        <td className="py-3">
                          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                            Close
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Market Prices */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Market Prices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tradingPairs.map((item, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{item.pair}</h3>
                      <span className={`text-sm ${
                        item.status === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {item.change}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-gray-400 text-xs">Bid</p>
                        <p className="text-white font-semibold">{item.bid}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Ask</p>
                        <p className="text-white font-semibold">{item.ask}</p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          Buy
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          Sell
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trading' && (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Advanced Trading Interface</h2>
            <p className="text-gray-400">Advanced charting and trading tools coming soon...</p>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Portfolio Analysis</h2>
            <p className="text-gray-400">Detailed portfolio breakdown and analytics coming soon...</p>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Transaction History</h2>
              <div className="flex gap-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Deposit
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Withdraw
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Type</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Amount</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Status</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(tx => (
                    <tr key={tx.id} className="border-t border-gray-700">
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs capitalize ${
                          tx.type === 'deposit' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white font-semibold">${tx.amount.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs capitalize">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
