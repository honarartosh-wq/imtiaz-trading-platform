import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign,
  AlertCircle,
  LogOut,
  Settings,
  Bell,
  PlusCircle,
  UserPlus
} from 'lucide-react';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalBranches: 3,
    totalAdmins: 5,
    totalClients: 127,
    totalVolume: '$2,450,000',
    monthlyRevenue: '$45,800',
    activeRisks: 3
  };

  const branches = [
    { id: 1, name: 'Branch A', admins: 2, clients: 45, volume: '$850,000', status: 'active' },
    { id: 2, name: 'Branch B', admins: 2, clients: 52, volume: '$980,000', status: 'active' },
    { id: 3, name: 'Branch C', admins: 1, clients: 30, volume: '$620,000', status: 'active' }
  ];

  const recentActivity = [
    { id: 1, action: 'New client registered', branch: 'Branch A', time: '2 hours ago' },
    { id: 2, action: 'Large trade executed', branch: 'Branch B', time: '4 hours ago' },
    { id: 3, action: 'Admin added', branch: 'Branch C', time: '6 hours ago' },
    { id: 4, action: 'Risk threshold exceeded', branch: 'Branch A', time: '1 day ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manager Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome back, {user.name}</p>
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
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'branches'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Branches
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
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
                  <h3 className="text-gray-400 text-sm">Total Branches</h3>
                  <Building2 className="text-blue-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalBranches}</p>
                <p className="text-green-400 text-sm mt-2">All active</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Admins</h3>
                  <Users className="text-purple-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalAdmins}</p>
                <p className="text-gray-400 text-sm mt-2">Across all branches</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Clients</h3>
                  <Users className="text-green-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
                <p className="text-green-400 text-sm mt-2">+12 this month</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Volume</h3>
                  <DollarSign className="text-yellow-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalVolume}</p>
                <p className="text-green-400 text-sm mt-2">+18% from last month</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Monthly Revenue</h3>
                  <TrendingUp className="text-green-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.monthlyRevenue}</p>
                <p className="text-green-400 text-sm mt-2">+22% growth</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Active Risks</h3>
                  <AlertCircle className="text-red-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">{stats.activeRisks}</p>
                <p className="text-red-400 text-sm mt-2">Requires attention</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{activity.action}</p>
                      <p className="text-gray-400 text-sm">{activity.branch}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Branch Management</h2>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <PlusCircle className="w-4 h-4" />
                Add Branch
              </button>
            </div>

            <div className="grid gap-6">
              {branches.map(branch => (
                <div key={branch.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-3 rounded-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{branch.name}</h3>
                        <span className="inline-block mt-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                          {branch.status}
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                      <UserPlus className="w-4 h-4" />
                      Add Admin
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Admins</p>
                      <p className="text-2xl font-bold text-white">{branch.admins}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Clients</p>
                      <p className="text-2xl font-bold text-white">{branch.clients}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Volume</p>
                      <p className="text-2xl font-bold text-white">{branch.volume}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Analytics Dashboard</h2>
            <p className="text-gray-400">Detailed analytics and reporting coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
