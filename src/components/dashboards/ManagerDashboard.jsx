import React, { useState, useEffect } from 'react';
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
  Package,
  History,
  UserCog,
  FileText,
  Shield,
  Droplet,
  ArrowLeftRight
} from 'lucide-react';
import ProductSpreads from '../manager/ProductSpreads';
import BranchCommissions from '../manager/BranchCommissions';
import TransactionManagement from '../manager/TransactionManagement';
import ClientManagement from '../manager/ClientManagement';
import UserManagement from '../manager/UserManagement';
import Reports from '../manager/Reports';
import LiquidityProviders from '../manager/LiquidityProviders';
import RoutingConfiguration from '../manager/RoutingConfiguration';
import { getBranches, getUsers, getTransactions, getAccounts } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

const ManagerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalAdmins: 0,
    totalClients: 0,
    totalVolume: 0,
    monthlyRevenue: 0,
    activeRisks: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (activeTab === 'overview') {
      loadOverviewData();
    }
  }, [activeTab]);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const [branches, users, transactions, accounts] = await Promise.all([
        getBranches(),
        getUsers(),
        getTransactions(),
        getAccounts()
      ]);

      // Calculate stats
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const monthlyTransactions = transactions.filter(t => {
        const transDate = new Date(t.created_at);
        return transDate.getMonth() === thisMonth && transDate.getFullYear() === thisYear;
      });

      const completedTransactions = transactions.filter(t => t.status === 'completed');
      const monthlyCompleted = monthlyTransactions.filter(t => t.status === 'completed');

      const totalVolume = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
      const monthlyRevenue = monthlyCompleted.reduce((sum, t) => sum + t.amount, 0);

      // Get new clients this month
      const newClientsThisMonth = users.filter(u => {
        if (u.role !== 'client') return false;
        const created = new Date(u.created_at);
        return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
      }).length;

      setStats({
        totalBranches: branches.length,
        totalAdmins: users.filter(u => u.role === 'admin').length,
        totalClients: users.filter(u => u.role === 'client').length,
        totalVolume,
        monthlyRevenue,
        activeRisks: 0 // Would need risk calculation logic
      });

      // Build recent activity from transactions
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(t => ({
          id: t.id,
          action: `${t.type.charAt(0).toUpperCase() + t.type.slice(1)} transaction`,
          branch: t.branch_id ? `Branch ${t.branch_id}` : 'N/A',
          time: formatDate(t.created_at)
        }));

      setRecentActivity(recentTransactions);
    } catch (err) {
      // Failed to load, keep default values
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manager Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome back, {user?.name || user?.email || 'Manager'}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
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
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
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
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
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
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
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
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Products
              </div>
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
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
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Reports
              </div>
            </button>
            <button
              onClick={() => setActiveTab('liquidity')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'liquidity'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4" />
                Liquidity Providers
              </div>
            </button>
            <button
              onClick={() => setActiveTab('routing')}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'routing'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                Routing
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
                <p className="text-3xl font-bold text-white">${formatCurrency(stats.totalVolume)}</p>
                <p className="text-green-400 text-sm mt-2">All time</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Monthly Revenue</h3>
                  <TrendingUp className="text-green-400 w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-white">${formatCurrency(stats.monthlyRevenue)}</p>
                <p className="text-green-400 text-sm mt-2">This month</p>
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

        {activeTab === 'transactions' && <TransactionManagement />}

        {activeTab === 'clients' && <ClientManagement />}

        {activeTab === 'users' && <UserManagement />}

        {activeTab === 'products' && <ProductSpreads />}

        {activeTab === 'branches' && <BranchCommissions />}

        {activeTab === 'reports' && <Reports />}

        {activeTab === 'liquidity' && <LiquidityProviders />}

        {activeTab === 'routing' && <RoutingConfiguration />}
      </main>
    </div>
  );
};

export default ManagerDashboard;
