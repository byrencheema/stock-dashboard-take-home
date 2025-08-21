import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Stock } from '../types/stock';

interface StockChartProps {
  stocks: Stock[];
}

export const StockChart: React.FC<StockChartProps> = ({ stocks }) => {
  const chartData = stocks.map((stock) => ({
    symbol: stock.symbol,
    price: stock.price,
    change: stock.changePercent,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-surface border border-dark-border p-3 rounded">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-gray-400">
            Price: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Price Overview</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis 
            dataKey="symbol" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};