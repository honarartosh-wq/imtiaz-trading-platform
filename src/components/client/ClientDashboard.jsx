import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LogOut, Wallet, TrendingUp, History, BarChart3 } from 'lucide-react';
import { AccountOverview } from './AccountOverview';
import { MarketPrices } from './MarketPrices';
import { PositionsList } from './PositionsList';
import { Button } from '../shared/Button';

/**
 * Client Dashboard Component - Full Implementation
 * Main dashboard for trading clients
 */
function ClientDashboard({ user, branch, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalance, setShowBalance] = useState(true);

  // Account data state
  const [accountData, setAccountData] = useState({
    balance: 50000,
    equity: 52500,
    freeMargin: 47500,
    marginLevel: 1050,
    unrealizedPL: 2500,
  });

  // Market prices state
  const [marketPrices, setMarketPrices] = useState({
    EURUSD: { bid: 1.09485, ask: 1.09495, spread: 1.0 },
    GBPUSD: { bid: 1.26475, ask: 1.26488, spread: 1.3 },
    USDJPY: { bid: 149.825, ask: 149.845, spread: 2.0 },
    XAUUSD: { bid: 2658.2, ask: 2658.8, spread: 6.0 },
    BTCUSD: { bid: 91250.0, ask: 91280.0, spread: 30.0 },
  });

  // Positions state
  const [positions, setPositions] = useState([
    {
      id: 1,
      symbol: 'EURUSD',
      type: 'BUY',
      lots: 0.1,
      openPrice: 1.0945,
      currentPrice: 1.0965,
      profit: 200,
    },
    {
      id: 2,
      symbol: 'XAUUSD',
      type: 'SELL',
      lots: 0.05,
      openPrice: 2665.8,
      currentPrice: 2658.4,
      profit: 370,
    },
    {
      id: 3,
      symbol: 'GBPUSD',
      type: 'BUY',
      lots: 0.15,
      openPrice: 1.2635,
      currentPrice: 1.2648,
      profit: 195,
    },
  ]);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices((prev) => {
        const updated = {};
        Object.keys(prev).forEach((symbol) => {
          const change = (Math.random() - 0.5) * 0.0002;
          const newBid = prev[symbol].bid + change;
          const newAsk = newBid + prev[symbol].spread / 10000;
          updated[symbol] = {
            bid: parseFloat(
              newBid.toFixed(symbol === 'XAUUSD' || symbol === 'BTCUSD' ? 2 : 5)
            ),
            ask: parseFloat(
              newAsk.toFixed(symbol === 'XAUUSD' || symbol === 'BTCUSD' ? 2 : 5)
            ),
            spread: prev[symbol].spread,
          };
        });
        return updated;
      });

      // Update position prices
      setPositions((prev) =>
        prev.map((pos) => {
          if (marketPrices[pos.symbol]) {
            const currentPrice =
              pos.type === 'BUY'
                ? marketPrices[pos.symbol].bid
                : marketPrices[pos.symbol].ask;
            const priceDiff = pos.type === 'BUY' ? currentPrice - pos.openPrice : pos.openPrice - currentPrice;
            const profit = priceDiff * pos.lots * 100000; // Simplified P/L calculation
            return { ...pos, currentPrice, profit: parseFloat(profit.toFixed(2)) };
          }
          return pos;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [marketPrices]);

  // Update account equity based on positions
  useEffect(() => {
    const totalPL = positions.reduce((sum, pos) => sum + pos.profit, 0);
    setAccountData((prev) => ({
      ...prev,
      equity: prev.balance + totalPL,
      unrealizedPL: totalPL,
    }));
  }, [positions]);

  const handleClosePosition = (positionId) => {
    const position = positions.find((p) => p.id === positionId);
    if (position) {
      // Add profit to balance
      setAccountData((prev) => ({
        ...prev,
        balance: prev.balance + position.profit,
      }));
      // Remove position
      setPositions((prev) => prev.filter((p) => p.id !== positionId));
      alert(`✅ Position closed. P/L: $${position.profit.toFixed(2)}`);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'positions', label: 'Positions', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-purple-400">Client Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome, {user.name} • Account: {user.account_number}
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={onLogout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 bg-slate-800/50 rounded-xl p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <AccountOverview
              accountData={accountData}
              showBalance={showBalance}
              onToggleBalance={() => setShowBalance(!showBalance)}
            />
            <MarketPrices prices={marketPrices} onSelectSymbol={(symbol) => console.log(symbol)} />
            <PositionsList positions={positions} onClosePosition={handleClosePosition} />
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <Wallet size={48} className="mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Wallet Management</h3>
            <p className="text-slate-400 mb-4">Deposit and withdrawal features coming soon</p>
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              ${accountData.balance.toLocaleString()}
            </div>
            <p className="text-slate-500 text-sm">Current Balance</p>
          </div>
        )}

        {activeTab === 'positions' && (
          <div>
            <PositionsList positions={positions} onClosePosition={handleClosePosition} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <History size={48} className="mx-auto text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Transaction History</h3>
            <p className="text-slate-400">Trade history and reports coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

ClientDashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    account_number: PropTypes.string,
    branch_id: PropTypes.number,
  }).isRequired,
  branch: PropTypes.shape({
    id: PropTypes.number,
  }),
  onLogout: PropTypes.func.isRequired,
};

export default ClientDashboard;
