import React from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { Stock } from '../types/stock';

interface StockDetailChartProps {
  stock: Stock;
  onClose: () => void;
}

interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
}

// Generate sample historical data for the stock
const generateHistoricalData = (stock: Stock): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const basePrice = stock.price;
  const dates: Date[] = [];
  
  // Generate 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  
  let currentPrice = basePrice - (stock.change || 0);
  
  dates.forEach((date, index) => {
    // Add some realistic price movement
    const volatility = basePrice * 0.02; // 2% daily volatility
    const change = (Math.random() - 0.5) * volatility;
    currentPrice += change;
    
    // Ensure the last day matches current price
    if (index === dates.length - 1) {
      currentPrice = basePrice;
    }
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    });
  });
  
  return data;
};

export const StockDetailChart: React.FC<StockDetailChartProps> = ({ stock, onClose }) => {
  const historicalData = generateHistoricalData(stock);
  const isPositive = stock.change >= 0;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-surface border border-dark-border p-3 rounded shadow-lg">
          <p className="text-sm font-medium text-gray-300">{label}</p>
          <p className="text-sm text-gray-100">
            Price: ${payload[0].value.toFixed(2)}
          </p>
          {payload[1] && (
            <p className="text-sm text-gray-400">
              Volume: {(payload[1].value / 1000000).toFixed(1)}M
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-bg border border-dark-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">{stock.symbol}</h2>
              <p className="text-gray-400">{stock.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-dark-surface p-4 rounded-lg">
              <p className="text-sm text-gray-400">Current Price</p>
              <p className="text-xl font-semibold">${stock.price.toFixed(2)}</p>
            </div>
            <div className="bg-dark-surface p-4 rounded-lg">
              <p className="text-sm text-gray-400">Change</p>
              <p className={`text-xl font-semibold ${isPositive ? 'text-green-stock' : 'text-red-stock'}`}>
                {isPositive ? '+' : ''}${stock.change.toFixed(2)}
              </p>
            </div>
            <div className="bg-dark-surface p-4 rounded-lg">
              <p className="text-sm text-gray-400">Change %</p>
              <p className={`text-xl font-semibold ${isPositive ? 'text-green-stock' : 'text-red-stock'}`}>
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </p>
            </div>
            <div className="bg-dark-surface p-4 rounded-lg">
              <p className="text-sm text-gray-400">Volume</p>
              <p className="text-xl font-semibold">
                {(stock.volume / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
          
          <div className="bg-dark-surface rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">30-Day Price Chart</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPositive ? '#10b981' : '#ef4444'} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPositive ? '#10b981' : '#ef4444'} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  fill={`url(#gradient-${stock.symbol})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};