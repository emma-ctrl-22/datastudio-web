import { Card, List, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { RecentlyReceivedItem } from '../../../types';

const { Text } = Typography;

interface RecentActivityFeedProps {
  data: RecentlyReceivedItem[];
  loading: boolean;
}

export function RecentActivityFeed({ data, loading }: RecentActivityFeedProps) {
  return (
    <Card title="Recently Received Items" loading={loading}>
      <List
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<Link to={`/products/${item.product_id}/edit`}>{item.product_name}</Link>}
              description={
                <Text type="secondary">
                  {`Received ${item.quantity_received} units from ${item.supplier_name} on ${new Date(item.received_date).toLocaleDateString()}`}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
