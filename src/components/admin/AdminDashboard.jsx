import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LogOut, BarChart3, Users, History, Copy, CheckCircle } from 'lucide-react';
import { BranchStats } from './BranchStats';
import { ClientsList } from './ClientsList';
import { TransactionHistory } from './TransactionHistory';
import { Button } from '../shared/Button';

/**
 * Admin Dashboard Component - Full Implementation
 * Dashboard for branch admins to manage clients
 */
function AdminDashboard({ user, branch, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [referralCopied, setReferralCopied] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  // Mock data - would come from API in production
  const [stats] = useState({
    totalClients: 12,
    totalDeposits: 450000,
    activePositions: 28,
    todayVolume: 125000,
  });

  const [clients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      account: 'ACC-10001',
      balance: 50000,
      equity: 52500,
      freeMargin: 47500,
      marginLevel: 1050,
      usedMargin: 5000,
      status: 'active',
      accountType: 'standard',
      openPositions: 3,
      totalProfit: 2500,
      todayTrades: 5,
      lastActive: '2024-11-19 14:30',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      account: 'ACC-10002',
      balance: 75000,
      equity: 76850,
      freeMargin: 68350,
      marginLevel: 902,
      usedMargin: 8500,
      status: 'active',
      accountType: 'business',
      openPositions: 5,
      totalProfit: 1850,
      todayTrades: 12,
      lastActive: '2024-11-19 15:45',
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@example.com',
      account: 'ACC-10003',
      balance: 30000,
      equity: 29500,
      freeMargin: 28000,
      marginLevel: 1967,
      usedMargin: 1500,
      status: 'active',
      accountType: 'standard',
      openPositions: 1,
      totalProfit: -500,
      todayTrades: 2,
      lastActive: '2024-11-19 12:15',
    },
  ]);

  const [transactions] = useState([
    {
      id: 1,
      date: '2024-11-19 10:30',
      type: 'deposit',
      clientName: 'John Smith',
      clientAccount: 'ACC-10001',
      amount: 10000,
      description: 'Bank wire transfer',
      performedBy: user.name,
    },
    {
      id: 2,
      date: '2024-11-19 14:20',
      type: 'withdrawal',
      clientName: 'Sarah Johnson',
      clientAccount: 'ACC-10002',
      amount: 5000,
      description: 'Profit withdrawal',
      performedBy: user.name,
    },
    {
      id: 3,
      date: '2024-11-18 09:15',
      type: 'deposit',
      clientName: 'Mike Wilson',
      clientAccount: 'ACC-10003',
      amount: 15000,
      description: 'Initial deposit',
      performedBy: user.name,
    },
    {
      id: 4,
      date: '2024-11-18 16:45',
      type: 'commission',
      clientName: 'Sarah Johnson',
      clientAccount: 'ACC-10002',
      amount: 250,
      description: 'Trading commission',
      performedBy: 'System',
    },
  ]);

  const handleCopyReferral = () => {
    const referralCode = user.referral_code || 'MAIN001-REF';
    navigator.clipboard.writeText(referralCode);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const handleTogglePassword = (clientId) => {
    setShowPasswords((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  const handleViewPositions = (client) => {
    alert(`Viewing positions for ${client.name}\n\nOpen Positions: ${client.openPositions}\nTotal P/L: $${client.totalProfit}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: History },
  ];

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white\">
      {/* Header */}
      <div className=\"bg-slate-800/50 border-b border-slate-700 px-6 py-4\">
        <div className=\"max-w-7xl mx-auto flex justify-between items-center\">
          <div>
            <h1 className=\"text-2xl font-bold text-blue-400\">Admin Dashboard</h1>
            <p className=\"text-slate-400 text-sm mt-1\">
              Welcome, {user.name} • Branch Admin
            </p>
          </div>
          <div className=\"flex items-center space-x-3\">
            {/* Referral Code */}
            <div className=\"bg-slate-800 rounded-lg px-4 py-2 border border-slate-700\">
              <div className=\"text-xs text-slate-400 mb-1\">Your Referral Code</div>
              <div className=\"flex items-center space-x-2\">
                <code className=\"text-emerald-400 font-mono font-semibold\">
                  {user.referral_code || 'MAIN001-REF'}
                </code>
                <button
                  onClick={handleCopyReferral}
                  className=\"text-slate-400 hover:text-white transition-colors\"
                >
                  {referralCopied ? (
                    <CheckCircle size={16} className=\"text-emerald-400\" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
            <Button variant=\"danger\" size=\"sm\" onClick={onLogout}>
              <LogOut size={16} className=\"mr-2\" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=\"max-w-7xl mx-auto p-6\">
        {/* Navigation Tabs */}
        <div className=\"flex space-x-2 mb-6 bg-slate-800/50 rounded-xl p-2\">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
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
            <BranchStats stats={stats} />
            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
              <ClientsList
                clients={clients.slice(0, 3)}
                onViewPositions={handleViewPositions}
                showPasswords={showPasswords}
                onTogglePassword={handleTogglePassword}
              />
              <TransactionHistory transactions={transactions.slice(0, 4)} />
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div>
            <ClientsList
              clients={clients}
              onViewPositions={handleViewPositions}
              showPasswords={showPasswords}
              onTogglePassword={handleTogglePassword}
            />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <TransactionHistory transactions={transactions} />
          </div>
        )}
      </div>
    </div>
  );
}

AdminDashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    branch_id: PropTypes.number,
    referral_code: PropTypes.string,
  }).isRequired,
  branch: PropTypes.shape({
    id: PropTypes.number,
  }),
  onLogout: PropTypes.func.isRequired,
};

export default AdminDashboard;
