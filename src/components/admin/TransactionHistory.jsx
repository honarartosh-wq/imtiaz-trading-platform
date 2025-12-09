import React from 'react';
import PropTypes from 'prop-types';
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';

/**
 * Transaction History Component
 * Displays list of transactions
 */
export function TransactionHistory({ transactions }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle size={18} className="text-emerald-400" />;
      case 'withdrawal':
        return <ArrowUpCircle size={18} className="text-red-400" />;
      default:
        return <DollarSign size={18} className="text-blue-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'text-emerald-400';
      case 'withdrawal':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="text-center py-8 text-slate-400">
          <p>No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Transactions ({transactions.length})
      </h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-slate-800 rounded-lg">{getTypeIcon(transaction.type)}</div>
              <div>
                <div className="text-white font-medium">{transaction.clientName}</div>
                <div className="text-slate-400 text-sm">
                  {transaction.clientAccount} • {transaction.date}
                </div>
                <div className="text-slate-500 text-xs mt-1">{transaction.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                {transaction.type === 'withdrawal' ? '-' : '+'}
                ${transaction.amount.toLocaleString()}
              </div>
              <div className="text-slate-500 text-xs">by {transaction.performedBy}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

TransactionHistory.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      clientName: PropTypes.string.isRequired,
      clientAccount: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      description: PropTypes.string,
      performedBy: PropTypes.string,
    })
  ).isRequired,
};
