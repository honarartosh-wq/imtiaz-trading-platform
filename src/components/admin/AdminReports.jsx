import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity
} from 'lucide-react';

const AdminReports = ({ branchName }) => {
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    totalClients: 38,
    newClients: 5,
    totalDeposits: 125000,
    totalWithdrawals: 45000,
    totalTrades: 234,
    totalCommission: 12500,
    netProfit: 8750,
    topClients: [
      { name: 'John Doe', account: 'CLT-001', trades: 45, commission: 2500, profit: 1200 },
      { name: 'Jane Smith', account: 'CLT-002', trades: 62, commission: 3200, profit: 1500 },
      { name: 'Bob Wilson', account: 'CLT-003', trades: 28, commission: 1100, profit: -200 }
    ],
    dailyStats: [
      { date: '2025-12-15', deposits: 15000, withdrawals: 5000, trades: 45, commission: 1200 },
      { date: '2025-12-16', deposits: 20000, withdrawals: 8000, trades: 52, commission: 1500 },
      { date: '2025-12-17', deposits: 18000, withdrawals: 6000, trades: 38, commission: 980 },
      { date: '2025-12-18', deposits: 22000, withdrawals: 7000, trades: 48, commission: 1320 },
      { date: '2025-12-19', deposits: 25000, withdrawals: 9000, trades: 51, commission: 1400 }
    ]
  });

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleExport = (format) => {
    alert(`Exporting report as ${format.toUpperCase()}...\nDate Range: ${dateRange}\nBranch: ${branchName || 'Current Branch'}`);
  };

  const getDateRangeLabel = () => {
    const labels = {
      week: 'Last 7 Days',
      month: 'Last 30 Days',
      quarter: 'Last 90 Days',
      year: 'Last 12 Months'
    };
    return labels[dateRange] || 'Custom Range';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            Branch Reports & Analytics
          </h2>
          <p className="text-gray-400 mt-1">
            {branchName || 'Current Branch'} - {getDateRangeLabel()}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Select Date Range</span>
        </div>
        <div className="flex gap-3">
          {[
            { key: 'week', label: 'Last 7 Days' },
            { key: 'month', label: 'Last 30 Days' },
            { key: 'quarter', label: 'Last 90 Days' },
            { key: 'year', label: 'Last Year' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setDateRange(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Clients</h3>
            <Users className="text-blue-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{reportData.totalClients}</p>
          <p className="text-green-400 text-sm mt-2">+{reportData.newClients} new this period</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Deposits</h3>
            <ArrowDownCircle className="text-green-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">${reportData.totalDeposits.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-2">Incoming funds</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Withdrawals</h3>
            <ArrowUpCircle className="text-red-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">${reportData.totalWithdrawals.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-2">Outgoing funds</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Commission</h3>
            <DollarSign className="text-yellow-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">${reportData.totalCommission.toLocaleString()}</p>
          <p className="text-green-400 text-sm mt-2">From {reportData.totalTrades} trades</p>
        </div>
      </div>

      {/* Daily Performance Chart */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Daily Performance</h3>
        </div>
        <div className="space-y-3">
          {reportData.dailyStats.map((stat, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{new Date(stat.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {stat.trades} trades • ${stat.commission.toLocaleString()} commission
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400">+${stat.deposits.toLocaleString()}</div>
                  <div className="text-red-400">-${stat.withdrawals.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Clients */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-xl font-bold text-white">Top Performing Clients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Client</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Account</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Trades</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Commission</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {reportData.topClients.map((client, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4 text-white">{client.name}</td>
                  <td className="py-3 px-4 text-gray-400">{client.account}</td>
                  <td className="py-3 px-4 text-right text-white">{client.trades}</td>
                  <td className="py-3 px-4 text-right text-yellow-400">${client.commission.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    client.profit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {client.profit >= 0 ? '+' : ''}${client.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Performance Summary */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-400 mb-1">Net Deposit Flow</div>
            <div className="text-2xl font-bold text-green-400">
              +${(reportData.totalDeposits - reportData.totalWithdrawals).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Total Trades</div>
            <div className="text-2xl font-bold text-white">{reportData.totalTrades}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Net Branch Profit</div>
            <div className="text-2xl font-bold text-green-400">
              ${reportData.netProfit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
