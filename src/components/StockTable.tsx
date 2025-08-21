import React from 'react';
import type { Stock } from '../types/stock';

interface StockTableProps {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  onSort: (key: keyof Stock) => void;
  sortConfig: { key: keyof Stock | null; direction: 'asc' | 'desc' };
  favorites: Set<string>;
  onToggleFavorite: (symbol: string) => void;
}

export const StockTable: React.FC<StockTableProps> = ({ stocks, loading, error, onSort, sortConfig, favorites, onToggleFavorite }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-dark-surface rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-dark-border">
            <th className="pb-4 font-medium text-gray-400 text-sm w-10"></th>
            <th className="pb-4 font-medium text-gray-400 text-sm cursor-pointer hover:text-gray-200" onClick={() => onSort('symbol')}>Symbol {sortConfig.key === 'symbol' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th className="pb-4 font-medium text-gray-400 text-sm">Name</th>
            <th className="pb-4 font-medium text-gray-400 text-sm text-right cursor-pointer hover:text-gray-200" onClick={() => onSort('price')}>Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th className="pb-4 font-medium text-gray-400 text-sm text-right">Change</th>
            <th className="pb-4 font-medium text-gray-400 text-sm text-right cursor-pointer hover:text-gray-200" onClick={() => onSort('changePercent')}>Change % {sortConfig.key === 'changePercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
            <th className="pb-4 font-medium text-gray-400 text-sm text-right cursor-pointer hover:text-gray-200" onClick={() => onSort('volume')}>Volume {sortConfig.key === 'volume' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol} className="border-b border-dark-border hover:bg-dark-surface transition-colors">
              <td className="py-4 text-center">
                <button
                  onClick={() => onToggleFavorite(stock.symbol)}
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {favorites.has(stock.symbol) ? '★' : '☆'}
                </button>
              </td>
              <td className="py-4 font-medium">{stock.symbol}</td>
              <td className="py-4 text-gray-400">{stock.name}</td>
              <td className="py-4 text-right font-medium">{formatPrice(stock.price)}</td>
              <td className={`py-4 text-right font-medium ${stock.change >= 0 ? 'text-green-stock' : 'text-red-stock'}`}>
                {stock.change >= 0 ? '+' : ''}{formatPrice(stock.change)}
              </td>
              <td className={`py-4 text-right font-medium ${stock.change >= 0 ? 'text-green-stock' : 'text-red-stock'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </td>
              <td className="py-4 text-right text-gray-400">{formatNumber(stock.volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};