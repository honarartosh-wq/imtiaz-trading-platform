import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Eye,
  Settings as SettingsIcon
} from 'lucide-react';

const RiskManagement = () => {
  const [riskAlerts] = useState([
    {
      id: 1,
      type: 'high_leverage',
      severity: 'high',
      client: 'John Doe',
      account: 'CLT-001',
      branch: 'Main Branch',
      description: 'Client using 1:200 leverage with low margin level (105%)',
      value: 105,
      threshold: 100,
      timestamp: '2025-12-21 10:45'
    },
    {
      id: 2,
      type: 'large_position',
      severity: 'medium',
      client: 'Jane Smith',
      account: 'CLT-002',
      branch: 'Main Branch',
      description: 'Large open position: 50 lots on EUR/USD',
      value: 50,
      threshold: 30,
      timestamp: '2025-12-21 09:30'
    },
    {
      id: 3,
      type: 'drawdown',
      severity: 'critical',
      client: 'Bob Wilson',
      account: 'CLT-003',
      branch: 'Downtown Branch',
      description: 'Account drawdown exceeded 20% limit',
      value: 23.5,
      threshold: 20,
      timestamp: '2025-12-21 08:15'
    }
  ]);

  const [riskMetrics] = useState({
    totalExposure: 2500000,
    netExposure: 150000,
    varDaily: 75000,
    marginUtilization: 68,
    highRiskClients: 12,
    totalClients: 145,
    avgLeverage: 85,
    maxDrawdown: 15.5
  });

  const getSeverityBadge = (severity) => {
    const badges = {
      critical: 'bg-red-900 text-red-200',
      high: 'bg-orange-900 text-orange-200',
      medium: 'bg-yellow-900 text-yellow-200',
      low: 'bg-blue-900 text-blue-200'
    };
    return badges[severity] || badges.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            Risk Management Dashboard
          </h2>
          <p className="text-gray-400 mt-1">Monitor and manage platform-wide risk exposure</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <SettingsIcon className="w-4 h-4" />
          Risk Settings
        </button>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Exposure</h3>
            <DollarSign className="text-blue-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">${(riskMetrics.totalExposure / 1000000).toFixed(2)}M</p>
          <p className="text-gray-400 text-sm mt-2">Net: ${(riskMetrics.netExposure / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">VaR (95%, 1-day)</h3>
            <TrendingDown className="text-orange-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">${(riskMetrics.varDaily / 1000).toFixed(0)}K</p>
          <p className="text-gray-400 text-sm mt-2">Value at Risk</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Margin Utilization</h3>
            <Activity className="text-yellow-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{riskMetrics.marginUtilization}%</p>
          <p className="text-gray-400 text-sm mt-2">Platform average</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">High Risk Clients</h3>
            <AlertTriangle className="text-red-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{riskMetrics.highRiskClients}</p>
          <p className="text-gray-400 text-sm mt-2">of {riskMetrics.totalClients} total</p>
        </div>
      </div>

      {/* Active Risk Alerts */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-xl font-bold text-white">Active Risk Alerts</h3>
          <span className="ml-auto bg-red-900 text-red-200 px-3 py-1 rounded-full text-sm font-medium">
            {riskAlerts.length} Active
          </span>
        </div>

        <div className="space-y-3">
          {riskAlerts.map(alert => (
            <div key={alert.id} className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-white font-medium">{alert.client} - {alert.account}</span>
                    <span className="text-gray-400 text-sm">{alert.branch}</span>
                  </div>
                  <p className="text-gray-300">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-gray-400">Current: <span className="text-red-400 font-medium">{alert.value}</span></span>
                    <span className="text-gray-400">Threshold: <span className="text-yellow-400 font-medium">{alert.threshold}</span></span>
                    <span className="text-gray-500 ml-auto">{alert.timestamp}</span>
                  </div>
                </div>
                <button className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Leverage Distribution</h3>
          <div className="space-y-3">
            {[
              { range: '1:50 or less', count: 45, percent: 31, color: 'bg-green-500' },
              { range: '1:51 - 1:100', count: 68, percent: 47, color: 'bg-blue-500' },
              { range: '1:101 - 1:200', count: 27, percent: 19, color: 'bg-yellow-500' },
              { range: 'Above 1:200', count: 5, percent: 3, color: 'bg-red-500' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{item.range}</span>
                  <span className="text-white">{item.count} clients ({item.percent}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Margin Level Distribution</h3>
          <div className="space-y-3">
            {[
              { range: 'Above 200%', count: 89, percent: 61, color: 'bg-green-500' },
              { range: '100% - 200%', count: 42, percent: 29, color: 'bg-yellow-500' },
              { range: '50% - 100%', count: 11, percent: 8, color: 'bg-orange-500' },
              { range: 'Below 50%', count: 3, percent: 2, color: 'bg-red-500' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{item.range}</span>
                  <span className="text-white">{item.count} clients ({item.percent}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Risk Positions */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Top Risk Positions by Exposure</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Symbol</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Net Exposure</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Clients</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Total Lots</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {[
                { symbol: 'EUR/USD', exposure: 125000, clients: 45, lots: 250, risk: 'medium' },
                { symbol: 'GBP/USD', exposure: 95000, clients: 32, lots: 190, risk: 'low' },
                { symbol: 'BTC/USD', exposure: 180000, clients: 18, lots: 150, risk: 'high' },
                { symbol: 'Gold', exposure: 150000, clients: 28, lots: 220, risk: 'medium' },
                { symbol: 'USD/JPY', exposure: 75000, clients: 22, lots: 145, risk: 'low' }
              ].map((position, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{position.symbol}</td>
                  <td className="py-3 px-4 text-right text-white">${(position.exposure / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-4 text-right text-gray-400">{position.clients}</td>
                  <td className="py-3 px-4 text-right text-gray-400">{position.lots}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      position.risk === 'high' ? 'bg-red-900 text-red-200' :
                      position.risk === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-green-900 text-green-200'
                    }`}>
                      {position.risk.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;
