import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  BarChart3,
  PieChart,
  AlertCircle
} from 'lucide-react';
import { getTransactions, getUsers, getAccounts, getBranches } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [reportData, setReportData] = useState({
    revenue: 0,
    transactions: 0,
    newClients: 0,
    activeAccounts: 0,
    topBranches: [],
    transactionsByType: {}
  });

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactions, users, accounts, branches] = await Promise.all([
        getTransactions(),
        getUsers(),
        getAccounts(),
        getBranches()
      ]);

      // Calculate date range
      const now = new Date();
      let startDate;
      switch (dateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Filter data by date range
      const filteredTransactions = transactions.filter(t =>
        new Date(t.created_at) >= startDate
      );
      const filteredUsers = users.filter(u =>
        new Date(u.created_at) >= startDate
      );

      // Calculate metrics
      const revenue = filteredTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      const transactionsByType = filteredTransactions.reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1;
        return acc;
      }, {});

      // Calculate branch performance
      const branchPerformance = branches.map(branch => {
        const branchTransactions = filteredTransactions.filter(t =>
          t.branch_id === branch.id && t.status === 'completed'
        );
        const branchRevenue = branchTransactions.reduce((sum, t) => sum + t.amount, 0);
        return {
          ...branch,
          transactionCount: branchTransactions.length,
          revenue: branchRevenue
        };
      }).sort((a, b) => b.revenue - a.revenue);

      setReportData({
        revenue,
        transactions: filteredTransactions.length,
        newClients: filteredUsers.filter(u => u.role === 'client').length,
        activeAccounts: accounts.filter(a => a.is_active).length,
        topBranches: branchPerformance.slice(0, 5),
        transactionsByType
      });
    } catch (err) {
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // In a real implementation, this would generate and download a CSV/PDF
    alert('Export functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading report data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-gray-400 mt-1">Comprehensive platform performance reports</p>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Date Range Selector */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4">
          <Calendar className="text-gray-400 w-5 h-5" />
          <span className="text-white font-medium">Report Period:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              This Year
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Revenue</h3>
            <DollarSign className="text-green-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">${formatCurrency(reportData.revenue)}</p>
          <p className="text-green-400 text-sm mt-2">
            {dateRange === 'week' ? 'Last 7 days' : dateRange === 'month' ? 'This month' : 'This year'}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Transactions</h3>
            <BarChart3 className="text-blue-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{reportData.transactions}</p>
          <p className="text-gray-400 text-sm mt-2">Total transactions</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">New Clients</h3>
            <Users className="text-purple-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{reportData.newClients}</p>
          <p className="text-gray-400 text-sm mt-2">New registrations</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Active Accounts</h3>
            <TrendingUp className="text-yellow-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{reportData.activeAccounts}</p>
          <p className="text-gray-400 text-sm mt-2">Currently active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Distribution */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-blue-400 w-5 h-5" />
            <h3 className="text-xl font-bold text-white">Transaction Distribution</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(reportData.transactionsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-white capitalize">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(count / reportData.transactions) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-white font-bold min-w-[3rem] text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(reportData.transactionsByType).length === 0 && (
              <p className="text-gray-400 text-center py-4">No transaction data available</p>
            )}
          </div>
        </div>

        {/* Top Performing Branches */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="text-green-400 w-5 h-5" />
            <h3 className="text-xl font-bold text-white">Top Performing Branches</h3>
          </div>
          <div className="space-y-3">
            {reportData.topBranches.map((branch, index) => (
              <div key={branch.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{branch.name}</p>
                    <p className="text-gray-400 text-sm">{branch.transactionCount} transactions</p>
                  </div>
                </div>
                <span className="text-green-400 font-bold">${formatCurrency(branch.revenue)}</span>
              </div>
            ))}
            {reportData.topBranches.length === 0 && (
              <p className="text-gray-400 text-center py-4">No branch data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-purple-400 w-5 h-5" />
          <h3 className="text-xl font-bold text-white">Report Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Average Transaction Value</p>
            <p className="text-2xl font-bold text-white">
              ${formatCurrency(reportData.transactions > 0 ? reportData.revenue / reportData.transactions : 0)}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Accounts per Client</p>
            <p className="text-2xl font-bold text-white">
              {reportData.newClients > 0 ? (reportData.activeAccounts / reportData.newClients).toFixed(1) : '0'}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Report Generated</p>
            <p className="text-xl font-bold text-white">{formatDate(new Date())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
