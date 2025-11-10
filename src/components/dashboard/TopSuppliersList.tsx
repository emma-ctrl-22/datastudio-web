import { Card, List, Avatar } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import type { TopSupplier } from '../../types';

interface TopSuppliersListProps {
  data: TopSupplier[];
  loading: boolean;
}

export function TopSuppliersList({ data, loading }: TopSuppliersListProps) {
  return (
    <Card title="Top Suppliers by PO Value" loading={loading}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={index === 0 ? <CrownOutlined /> : null}>{index + 1}</Avatar>}
              title={<a href="#">{item.supplier_name}</a>}
              description={`Total Value: $${Number(item.total_po_value).toLocaleString()}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
