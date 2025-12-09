import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Market Prices Component
 * Displays live market prices with bid/ask spread
 * Optimized with React.memo for performance
 */
export const MarketPrices = React.memo(function MarketPrices({ prices, onSelectSymbol }) {
  const symbols = [
    { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'forex' },
    { symbol: 'GBPUSD', name: 'British Pound / Dollar', category: 'forex' },
    { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'forex' },
    { symbol: 'XAUUSD', name: 'Gold / US Dollar', category: 'commodity' },
    { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', category: 'crypto' },
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'forex':
        return 'text-blue-400';
      case 'commodity':
        return 'text-amber-400';
      case 'crypto':
        return 'text-purple-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Live Market Prices</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {symbols.map(({ symbol, name, category }) => {
          const price = prices[symbol];
          if (!price) return null;

          return (
            <button
              key={symbol}
              onClick={() => onSelectSymbol && onSelectSymbol(symbol)}
              className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-sm font-medium ${getCategoryColor(category)}`}>
                  {symbol}
                </div>
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 mb-3">{name}</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-slate-500">Bid</div>
                  <div className="text-sm font-semibold text-white">{price.bid}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Ask</div>
                  <div className="text-sm font-semibold text-white">{price.ask}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Spread: {price.spread} pips
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

MarketPrices.propTypes = {
  prices: PropTypes.objectOf(
    PropTypes.shape({
      bid: PropTypes.number.isRequired,
      ask: PropTypes.number.isRequired,
      spread: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelectSymbol: PropTypes.func,
};
