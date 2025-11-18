import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  LogOut,
  Settings,
  Bell,
  UserPlus,
  FileText,
  Shield,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalClients: 45,
    activeClients: 38,
    pendingKYC: 3,
    totalVolume: '$850,000',
    monthlyCommission: '$12,500',
    riskAlerts: 2
  };

  const clients = [
    { id: 1, name: 'John Doe', account: 'CLT-001', balance: '$50,000', status: 'active', kyc: 'approved' },
    { id: 2, name: 'Jane Smith', account: 'CLT-002', balance: '$75,000', status: 'active', kyc: 'approved' },
    { id: 3, name: 'Bob Wilson', account: 'CLT-003', balance: '$32,000', status: 'active', kyc: 'pending' },
    { id: 4, name: 'Alice Brown', account: 'CLT-004', balance: '$95,000', status: 'inactive', kyc: 'approved' }
  ];

  const recentTrades = [
    { id: 1, client: 'John Doe', pair: 'EUR/USD', type: 'Buy', amount: '$5,000', profit: '+$250', time: '10:30 AM' },
    { id: 2, client: 'Jane Smith', pair: 'GBP/USD', type: 'Sell', amount: '$8,000', profit: '+$480', time: '11:15 AM' },
    { id: 3, client: 'Bob Wilson', pair: 'USD/JPY', type: 'Buy', amount: '$3,500', profit: '-$120', time: '12:45 PM' }
  ];

  const kycPending = [
    { id: 1, name: 'Bob Wilson', account: 'CLT-003', submitted: '2 days ago', documents: 3 },
    { id: 2, name: 'Charlie Davis', account: 'CLT-005', submitted: '5 days ago', documents: 2 },
    { id: 3, name: 'Eva Martinez', account: 'CLT-006', submitted: '1 week ago', documents: 4 }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">
                {user.name} • {user.branch}
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
                <Activity className="w-4 h-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Clients
              </div>
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'kyc'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                KYC/AML
                {stats.pendingKYC > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {stats.pendingKYC}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('trades')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'trades'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trades
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Clients</h3>
                  <Users className="text-blue-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
                <p className="text-gray-400 text-sm mt-2">{stats.activeClients} active</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Pending KYC</h3>
                  <FileText className="text-yellow-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.pendingKYC}</p>
                <p className="text-yellow-400 text-sm mt-2">Requires review</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Volume</h3>
                  <DollarSign className="text-green-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalVolume}</p>
                <p className="text-green-400 text-sm mt-2">This month</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Commission Earned</h3>
                  <TrendingUp className="text-purple-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.monthlyCommission}</p>
                <p className="text-green-400 text-sm mt-2">+15% from last month</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Risk Alerts</h3>
                  <AlertTriangle className="text-red-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.riskAlerts}</p>
                <p className="text-red-400 text-sm mt-2">Requires attention</p>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Recent Trades</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Client</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Pair</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Type</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Amount</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">P&L</th>
                      <th className="text-left text-gray-400 text-sm font-medium py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrades.map(trade => (
                      <tr key={trade.id} className="border-b border-gray-700">
                        <td className="py-3 text-white">{trade.client}</td>
                        <td className="py-3 text-white">{trade.pair}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            trade.type === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="py-3 text-white">{trade.amount}</td>
                        <td className={`py-3 font-semibold ${
                          trade.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.profit}
                        </td>
                        <td className="py-3 text-gray-400">{trade.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Client Management</h2>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <UserPlus className="w-4 h-4" />
                Add Client
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Name</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Account</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Balance</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Status</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">KYC</th>
                    <th className="text-left text-gray-300 text-sm font-medium py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id} className="border-t border-gray-700">
                      <td className="py-4 px-6 text-white">{client.name}</td>
                      <td className="py-4 px-6 text-gray-400">{client.account}</td>
                      <td className="py-4 px-6 text-white font-semibold">{client.balance}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs ${
                          client.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`flex items-center gap-1 text-sm ${
                          client.kyc === 'approved' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {client.kyc === 'approved' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          {client.kyc}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">KYC/AML Verification</h2>

            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pending Reviews</h3>
              <div className="space-y-4">
                {kycPending.map(item => (
                  <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold">{item.name}</h4>
                        <p className="text-gray-400 text-sm">Account: {item.account}</p>
                        <p className="text-gray-400 text-sm">Submitted {item.submitted} • {item.documents} documents</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trades' && (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Trade History</h2>
            <p className="text-gray-400">Detailed trade history and analytics coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
