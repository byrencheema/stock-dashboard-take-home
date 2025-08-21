import { useState, useMemo } from 'react';
import { StockTable } from './components/StockTable';
import { SearchBar } from './components/SearchBar';
import { StockDetailChart } from './components/StockDetailChart';
import { useStockData } from './hooks/useStockData';
import { useFavorites } from './hooks/useFavorites';
import type { Stock } from './types/stock';

function App() {
  const { stocks, loading, error, isUsingSampleData, refresh } = useStockData();
  const { favorites, toggleFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Stock | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        if (aValue! < bValue!) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue! > bValue!) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [stocks, searchTerm, sortConfig]);

  const handleSort = (key: keyof Stock) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Stock Dashboard</h1>
          <p className="text-gray-400">Real-time stock market data</p>
        </header>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-96">
              <SearchBar 
                value={searchTerm} 
                onChange={setSearchTerm}
                placeholder="Search by symbol or name..."
              />
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
            <StockTable 
              stocks={filteredAndSortedStocks} 
              loading={loading} 
              error={error}
              onSort={handleSort}
              sortConfig={sortConfig}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onStockClick={setSelectedStock}
            />
          </div>

          {stocks.length > 0 && (
            <div className="text-center text-sm text-gray-500">
              <p>Showing {filteredAndSortedStocks.length} of {stocks.length} stocks</p>
              {isUsingSampleData && (
                <p className="mt-1 text-yellow-500">
                  ⚠️ API failed, using sample data - Last updated: August 21, 2025
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {selectedStock && (
        <StockDetailChart 
          stock={selectedStock} 
          onClose={() => setSelectedStock(null)} 
        />
      )}
    </div>
  );
}

export default App;