import type { Stock, StockAPIResponse } from '../types/stock';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Default stocks to display
const DEFAULT_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];

// Sample data - Last updated: August 21, 2025
const SAMPLE_DATA: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 232.45, change: 3.21, changePercent: 1.40, volume: 48392100 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 178.92, change: -2.14, changePercent: -1.18, volume: 23145600 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 445.23, change: 5.67, changePercent: 1.29, volume: 19876500 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 189.34, change: 2.45, changePercent: 1.31, volume: 41234800 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 198.76, change: -4.32, changePercent: -2.13, volume: 98765400 },
  { symbol: 'META', name: 'Meta Platforms', price: 523.67, change: 7.89, changePercent: 1.53, volume: 15432100 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 892.34, change: 14.56, changePercent: 1.66, volume: 52143200 },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 687.45, change: -5.23, changePercent: -0.75, volume: 4567800 },
];

export async function fetchStockData(): Promise<{ stocks: Stock[], isUsingSampleData: boolean }> {
  if (!API_KEY) {
    return { stocks: SAMPLE_DATA, isUsingSampleData: true };
  }

  try {
    const promises = DEFAULT_SYMBOLS.map(async (symbol) => {
      const response = await fetch(
        `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StockAPIResponse = await response.json();
      
      // Check for API limit error
      if ('Note' in data || !data['Global Quote'] || !data['Global Quote']['01. symbol']) {
        throw new Error('API_LIMIT_REACHED');
      }
      
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        name: getCompanyName(quote['01. symbol']),
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
      };
    });

    const results = await Promise.all(promises);
    return { stocks: results, isUsingSampleData: false };
  } catch (error) {
    console.warn('API failed, using sample data:', error);
    // Return sample data when API fails
    return new Promise((resolve) => {
      setTimeout(() => resolve({ stocks: SAMPLE_DATA, isUsingSampleData: true }), 500);
    });
  }
}

function getCompanyName(symbol: string): string {
  const companyNames: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corp.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms',
    'NVDA': 'NVIDIA Corp.',
    'NFLX': 'Netflix Inc.',
  };
  return companyNames[symbol] || symbol;
}