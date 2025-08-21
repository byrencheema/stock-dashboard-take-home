import { useState, useEffect } from 'react';
import type { Stock } from '../types/stock';
import { fetchStockData } from '../services/stockApi';

export const useStockData = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);

  const loadStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const { stocks: data, isUsingSampleData: usingSample } = await fetchStockData();
      setStocks(data);
      setIsUsingSampleData(usingSample);
    } catch (err) {
      setError('Failed to load stock data. Please try again later.');
      console.error('Error loading stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  return { stocks, loading, error, isUsingSampleData, refresh: loadStocks };
};