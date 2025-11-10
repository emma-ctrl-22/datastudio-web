import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { StockMovementSummary } from '../../../types';

interface StockMovementsBarChartProps {
  data: StockMovementSummary;
  loading: boolean;
}

export function StockMovementsBarChart({ data, loading }: StockMovementsBarChartProps) {
  const chartData = [
    { name: 'In', quantity: data.total_in, fill: '#82ca9d' },
    { name: 'Out', quantity: data.total_out, fill: '#ffc658' },
    { name: 'Adjustments', quantity: data.total_adjustment, fill: '#8884d8' },
  ];

  return (
    <Card title="Stock Movements (Last 30 Days)" loading={loading}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
