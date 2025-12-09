import React, { useState, useEffect } from 'react';
import { Activity, Database, Cpu, HardDrive, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * System Monitoring Component
 * Displays real-time system health and metrics
 */
export function SystemMonitoring() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/health/detailed');
        const data = await response.json();
        setHealthData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch health data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse">Loading system metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-6">
        <AlertCircle className="text-red-400 mb-2" />
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-400';
      case 'degraded':
        return 'text-amber-400';
      case 'unhealthy':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={20} className="text-emerald-400" />;
      case 'degraded':
      case 'unhealthy':
        return <AlertCircle size={20} className="text-red-400" />;
      default:
        return <Activity size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">System Status</h3>
            <p className="text-slate-400 text-sm">
              Last updated: {new Date(healthData.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(healthData.status)}
            <span className={`text-lg font-bold capitalize ${getStatusColor(healthData.status)}`}>
              {healthData.status}
            </span>
          </div>
        </div>
      </div>

      {/* Component Health Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database Health */}
        {healthData.checks?.database && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <Database size={24} className="text-blue-400" />
              <h4 className="text-white font-semibold">Database</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status</span>
                <span className={`font-semibold capitalize ${getStatusColor(healthData.checks.database.status)}`}>
                  {healthData.checks.database.status}
                </span>
              </div>
              {healthData.checks.database.latency_ms !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Latency</span>
                  <span className="text-white">{healthData.checks.database.latency_ms}ms</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Metrics */}
        {healthData.checks?.system?.metrics && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <Cpu size={24} className="text-purple-400" />
              <h4 className="text-white font-semibold">System Resources</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">CPU Usage</span>
                  <span className="text-white font-semibold">
                    {healthData.checks.system.metrics.cpu_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      healthData.checks.system.metrics.cpu_percent > 80
                        ? 'bg-red-500'
                        : healthData.checks.system.metrics.cpu_percent > 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${healthData.checks.system.metrics.cpu_percent}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Memory Usage</span>
                  <span className="text-white font-semibold">
                    {healthData.checks.system.metrics.memory_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      healthData.checks.system.metrics.memory_percent > 80
                        ? 'bg-red-500'
                        : healthData.checks.system.metrics.memory_percent > 60
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${healthData.checks.system.metrics.memory_percent}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Disk Usage</span>
                  <span className="text-white font-semibold">
                    {healthData.checks.system.metrics.disk_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      healthData.checks.system.metrics.disk_percent > 80
                        ? 'bg-red-500'
                        : healthData.checks.system.metrics.disk_percent > 60
                        ? 'bg-amber-500'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${healthData.checks.system.metrics.disk_percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
