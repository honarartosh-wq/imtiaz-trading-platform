import React from 'react';
import PropTypes from 'prop-types';
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';

/**
 * Branch Statistics Component
 * Displays branch overview metrics
 */
export function BranchStats({ stats }) {
  const metrics = [
    {
      label: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
    },
    {
      label: 'Total Deposits',
      value: `$${stats.totalDeposits.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-600/20',
    },
    {
      label: 'Active Positions',
      value: stats.activePositions,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
    },
    {
      label: 'Today\'s Volume',
      value: `$${stats.todayVolume.toLocaleString()}`,
      icon: Activity,
      color: 'text-amber-400',
      bgColor: 'bg-amber-600/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <Icon size={24} className={metric.color} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-sm text-slate-400">{metric.label}</div>
          </div>
        );
      })}
    </div>
  );
}

BranchStats.propTypes = {
  stats: PropTypes.shape({
    totalClients: PropTypes.number.isRequired,
    totalDeposits: PropTypes.number.isRequired,
    activePositions: PropTypes.number.isRequired,
    todayVolume: PropTypes.number.isRequired,
  }).isRequired,
};
