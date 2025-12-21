import React, { useState } from 'react';
import {
  Shield,
  Filter,
  Calendar,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Building2
} from 'lucide-react';

const ManagerAuditLog = ({ user }) => {
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const [auditLogs] = useState([
    {
      id: 1,
      timestamp: '2025-12-21 11:15:30',
      user: user?.name || 'Manager',
      branch: 'All Branches',
      action: 'Updated LP Configuration',
      details: 'Modified commission settings for Prime Broker LP',
      type: 'lp',
      severity: 'info',
      ipAddress: '192.168.1.50'
    },
    {
      id: 2,
      timestamp: '2025-12-21 10:45:18',
      user: user?.name || 'Manager',
      branch: 'All Branches',
      action: 'Created Routing Rule',
      details: 'New A-Book routing rule for EUR/USD with 50+ lot sizes',
      type: 'routing',
      severity: 'success',
      ipAddress: '192.168.1.50'
    },
    {
      id: 3,
      timestamp: '2025-12-21 10:20:05',
      user: 'Admin User',
      branch: 'Main Branch',
      action: 'Client Account Created',
      details: 'Created new client: Sarah Johnson (CLT-006)',
      type: 'client',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: 4,
      timestamp: '2025-12-21 09:55:42',
      user: user?.name || 'Manager',
      branch: 'All Branches',
      action: 'Product Spread Updated',
      details: 'Changed EUR/USD spread from 1.5 to 1.8 pips',
      type: 'product',
      severity: 'warning',
      ipAddress: '192.168.1.50'
    },
    {
      id: 5,
      timestamp: '2025-12-21 09:30:15',
      user: 'Admin User',
      branch: 'Downtown Branch',
      action: 'Deposit Approved',
      details: 'Approved $10,000 deposit for Bob Wilson (CLT-003)',
      type: 'transaction',
      severity: 'success',
      ipAddress: '192.168.1.101'
    },
    {
      id: 6,
      timestamp: '2025-12-21 08:45:33',
      user: user?.name || 'Manager',
      branch: 'All Branches',
      action: 'Branch Commission Updated',
      details: 'Updated commission rates for Main Branch',
      type: 'branch',
      severity: 'info',
      ipAddress: '192.168.1.50'
    },
    {
      id: 7,
      timestamp: '2025-12-21 08:10:20',
      user: user?.name || 'Manager',
      branch: 'All Branches',
      action: 'Login',
      details: 'Successful login to manager dashboard',
      type: 'auth',
      severity: 'info',
      ipAddress: '192.168.1.50'
    },
    {
      id: 8,
      timestamp: '2025-12-20 18:30:45',
      user: 'Unknown',
      branch: 'N/A',
      action: 'Failed Login Attempt',
      details: 'Failed manager login attempt from unknown IP',
      type: 'auth',
      severity: 'error',
      ipAddress: '203.0.113.99'
    }
  ]);

  const getSeverityBadge = (severity) => {
    const badges = {
      info: { color: 'bg-blue-900 text-blue-200', icon: Activity },
      success: { color: 'bg-green-900 text-green-200', icon: CheckCircle },
      warning: { color: 'bg-yellow-900 text-yellow-200', icon: AlertCircle },
      error: { color: 'bg-red-900 text-red-200', icon: XCircle }
    };
    const badge = badges[severity] || badges.info;
    const Icon = badge.icon;
    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {severity.toUpperCase()}
      </span>
    );
  };

  const getTypeColor = (type) => {
    const colors = {
      transaction: 'text-green-400',
      client: 'text-blue-400',
      branch: 'text-purple-400',
      product: 'text-yellow-400',
      lp: 'text-cyan-400',
      routing: 'text-pink-400',
      auth: 'text-orange-400',
      settings: 'text-gray-400'
    };
    return colors[type] || 'text-gray-400';
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const handleExport = () => {
    alert(`Exporting audit logs...\nDate Range: ${dateRange}\nFilter: ${filter}\nTotal Records: ${filteredLogs.length}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            System Audit Log
          </h2>
          <p className="text-gray-400 mt-1">
            Platform-wide activity log for all branches
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Filter by Type</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'All' },
                { key: 'transaction', label: 'Transactions' },
                { key: 'client', label: 'Clients' },
                { key: 'branch', label: 'Branches' },
                { key: 'product', label: 'Products' },
                { key: 'lp', label: 'Liquidity' },
                { key: 'routing', label: 'Routing' },
                { key: 'auth', label: 'Auth' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Date Range</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' },
                { key: 'all', label: 'All Time' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setDateRange(key)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Events</div>
          <div className="text-2xl font-bold text-white">{filteredLogs.length}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Info</div>
          <div className="text-2xl font-bold text-blue-400">
            {filteredLogs.filter(l => l.severity === 'info').length}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Warnings</div>
          <div className="text-2xl font-bold text-yellow-400">
            {filteredLogs.filter(l => l.severity === 'warning').length}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Errors</div>
          <div className="text-2xl font-bold text-red-400">
            {filteredLogs.filter(l => l.severity === 'error').length}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Timestamp</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Branch</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Action</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Details</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    No audit logs found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="border-t border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 text-gray-400 text-sm whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{log.user}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{log.branch}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm max-w-md">
                      {log.details}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${getTypeColor(log.type)}`}>
                        {log.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {getSeverityBadge(log.severity)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-200 font-medium mb-1">System Audit Log</h4>
            <p className="text-blue-300 text-sm">
              All system-level and administrative actions across all branches are logged for security,
              compliance, and audit purposes. Logs are retained for 90 days and can be exported
              for regulatory compliance. Sensitive information is never logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAuditLog;
