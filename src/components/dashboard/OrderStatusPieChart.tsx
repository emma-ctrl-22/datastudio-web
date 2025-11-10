import { Card } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { OrderStatusSummary } from '../../types';

interface OrderStatusPieChartProps {
  title: string;
  data: OrderStatusSummary[];
  loading: boolean;
}

const COLORS: Record<string, string> = {
  draft: '#d9d9d9',
  sent: '#1890ff',
  part_received: '#faad14',
  received: '#52c41a',
  cancelled: '#bfbfbf',
  confirmed: '#13c2c2',
  dispatched: '#fa8c16',
  delivered: '#52c41a',
};

export function OrderStatusPieChart({ title, data, loading }: OrderStatusPieChartProps) {
  const chartData = data.filter(d => d.count > 0);

  return (
    <Card title={title} loading={loading}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="status"
            label={({ status, percent }) => `${status}: ${((percent as number) * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
