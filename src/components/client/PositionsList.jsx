import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Positions List Component
 * Displays open trading positions
 * Optimized with React.memo and useMemo
 */
export const PositionsList = React.memo(function PositionsList({ positions, onClosePosition }) {
  // Memoize total P/L calculation for performance
  const totalPL = useMemo(() => {
    if (!positions || positions.length === 0) return 0;
    return positions.reduce((sum, p) => sum + p.profit, 0);
  }, [positions]);

  if (!positions || positions.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Open Positions</h3>
        <div className="text-center py-8 text-slate-400">
          <p>No open positions</p>
          <p className="text-sm mt-2">Start trading to see your positions here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Open Positions ({positions.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
              <th className="pb-3">Symbol</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Lots</th>
              <th className="pb-3">Open Price</th>
              <th className="pb-3">Current Price</th>
              <th className="pb-3">Profit/Loss</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr
                key={position.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/30"
              >
                <td className="py-3 text-white font-medium">{position.symbol}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      position.type === 'BUY'
                        ? 'bg-emerald-600/20 text-emerald-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}
                  >
                    {position.type}
                  </span>
                </td>
                <td className="py-3 text-slate-300">{position.lots}</td>
                <td className="py-3 text-slate-300">{position.openPrice}</td>
                <td className="py-3 text-white font-medium">{position.currentPrice}</td>
                <td className="py-3">
                  <span
                    className={`font-semibold ${
                      position.profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {position.profit >= 0 ? '+' : ''}
                    ${position.profit.toFixed(2)}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => onClosePosition && onClosePosition(position.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-600/10"
                    aria-label="Close position"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
        <div className="text-slate-400 text-sm">Total P/L:</div>
        <div
          className={`text-xl font-bold ${
            totalPL >= 0
              ? 'text-emerald-400'
              : 'text-red-400'
          }`}
        >
          {totalPL >= 0 ? '+' : ''}
          ${totalPL.toFixed(2)}
        </div>
      </div>
    </div>
  );
});

PositionsList.propTypes = {
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      symbol: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['BUY', 'SELL']).isRequired,
      lots: PropTypes.number.isRequired,
      openPrice: PropTypes.number.isRequired,
      currentPrice: PropTypes.number.isRequired,
      profit: PropTypes.number.isRequired,
    })
  ).isRequired,
  onClosePosition: PropTypes.func,
};
