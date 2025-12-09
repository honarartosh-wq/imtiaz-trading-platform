import React from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, Key, TrendingUp } from 'lucide-react';
import { Button } from '../shared/Button';

/**
 * Clients List Component
 * Displays list of clients with their account information
 */
export function ClientsList({ clients, onViewPositions, showPasswords, onTogglePassword }) {
  const getStatusColor = (status) => {
    return status === 'active' ? 'text-emerald-400' : 'text-slate-400';
  };

  const getAccountTypeLabel = (type) => {
    return type === 'business' ? 'Business' : 'Standard';
  };

  if (!clients || clients.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Client Accounts</h3>
        <div className="text-center py-8 text-slate-400">
          <p>No clients yet</p>
          <p className="text-sm mt-2">Add your first client to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Client Accounts ({clients.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
              <th className="pb-3">Client Name</th>
              <th className="pb-3">Account</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Balance</th>
              <th className="pb-3">Equity</th>
              <th className="pb-3">Positions</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/30"
              >
                <td className="py-4">
                  <div className="text-white font-medium">{client.name}</div>
                  <div className="text-slate-400 text-sm">{client.email}</div>
                </td>
                <td className="py-4 text-slate-300 font-mono text-sm">{client.account}</td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      client.accountType === 'business'
                        ? 'bg-amber-600/20 text-amber-400'
                        : 'bg-blue-600/20 text-blue-400'
                    }`}
                  >
                    {getAccountTypeLabel(client.accountType)}
                  </span>
                </td>
                <td className="py-4 text-white font-semibold">
                  ${client.balance?.toLocaleString() || 0}
                </td>
                <td className="py-4 text-emerald-400 font-semibold">
                  ${client.equity?.toLocaleString() || 0}
                </td>
                <td className="py-4">
                  {client.openPositions ? (
                    <button
                      onClick={() => onViewPositions && onViewPositions(client)}
                      className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    >
                      <TrendingUp size={16} />
                      <span>{client.openPositions}</span>
                    </button>
                  ) : (
                    <span className="text-slate-500">0</span>
                  )}
                </td>
                <td className="py-4">
                  <span className={`capitalize ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onTogglePassword && onTogglePassword(client.id)}
                    >
                      {showPasswords[client.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ClientsList.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      account: PropTypes.string.isRequired,
      balance: PropTypes.number,
      equity: PropTypes.number,
      openPositions: PropTypes.number,
      status: PropTypes.string,
      accountType: PropTypes.string,
    })
  ).isRequired,
  onViewPositions: PropTypes.func,
  showPasswords: PropTypes.object,
  onTogglePassword: PropTypes.func,
};
