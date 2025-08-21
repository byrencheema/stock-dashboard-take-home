import type { Stock, StockAPIResponse } from '../types/stock';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Default stocks to display
const DEFAULT_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];


export async function fetchStockData(): Promise<Stock[]> {
  if (!API_KEY) {
    throw new Error('API key is required');
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
        throw new Error('API limit reached. Free tier allows 25 requests per day.');
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

    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
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