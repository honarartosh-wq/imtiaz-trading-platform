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
  Download
} from 'lucide-react';

const AdminAuditLog = ({ user, branchName }) => {
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const [auditLogs] = useState([
    {
      id: 1,
      timestamp: '2025-12-21 10:35:42',
      user: user?.name || 'Admin User',
      action: 'Approved Deposit',
      details: 'Approved deposit request of $5,000 for John Doe (CLT-001)',
      type: 'transaction',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2025-12-21 10:28:15',
      user: user?.name || 'Admin User',
      action: 'Client Created',
      details: 'Created new client account: Alice Brown (CLT-005)',
      type: 'client',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: 3,
      timestamp: '2025-12-21 09:45:33',
      user: user?.name || 'Admin User',
      action: 'KYC Approved',
      details: 'Approved KYC documents for Bob Wilson (CLT-003)',
      type: 'kyc',
      severity: 'success',
      ipAddress: '192.168.1.100'
    },
    {
      id: 4,
      timestamp: '2025-12-21 09:12:20',
      user: user?.name || 'Admin User',
      action: 'Withdrawal Rejected',
      details: 'Rejected withdrawal request of $2,500 for Jane Smith (CLT-002) - Insufficient documentation',
      type: 'transaction',
      severity: 'warning',
      ipAddress: '192.168.1.100'
    },
    {
      id: 5,
      timestamp: '2025-12-21 08:55:10',
      user: user?.name || 'Admin User',
      action: 'Login',
      details: 'Successful login to admin dashboard',
      type: 'auth',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: 6,
      timestamp: '2025-12-20 17:30:45',
      user: user?.name || 'Admin User',
      action: 'Settings Updated',
      details: 'Updated notification preferences',
      type: 'settings',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: 7,
      timestamp: '2025-12-20 16:22:18',
      user: user?.name || 'Admin User',
      action: 'Failed Login Attempt',
      details: 'Failed login attempt from unknown IP',
      type: 'auth',
      severity: 'error',
      ipAddress: '203.0.113.45'
    },
    {
      id: 8,
      timestamp: '2025-12-20 15:10:05',
      user: user?.name || 'Admin User',
      action: 'Client Updated',
      details: 'Updated contact information for John Doe (CLT-001)',
      type: 'client',
      severity: 'info',
      ipAddress: '192.168.1.100'
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
      kyc: 'text-purple-400',
      auth: 'text-yellow-400',
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
            Audit Log
          </h2>
          <p className="text-gray-400 mt-1">
            System activity log for {branchName || 'your branch'}
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
                { key: 'kyc', label: 'KYC' },
                { key: 'auth', label: 'Authentication' },
                { key: 'settings', label: 'Settings' }
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
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Action</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Details</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Severity</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">IP Address</th>
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
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {log.ipAddress}
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
            <h4 className="text-blue-200 font-medium mb-1">Audit Log Information</h4>
            <p className="text-blue-300 text-sm">
              All administrative actions are logged for security and compliance purposes.
              Logs are retained for 90 days and can be exported for audit purposes.
              Sensitive information such as passwords are never logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLog;
