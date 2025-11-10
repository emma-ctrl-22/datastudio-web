import { Table, Tag } from 'antd';
import { Link } from 'react-router-dom';
import type { LowStockProduct } from '../../types';

interface LowStockProductsProps {
  data: LowStockProduct[];
  loading: boolean;
}

export function LowStockProducts({ data, loading }: LowStockProductsProps) {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text: string, record: LowStockProduct) => <Link to={`/products/${record.product_id}/edit`}>{text}</Link>,
    },
    {
      title: 'Qty',
      dataIndex: 'current_quantity',
      key: 'current_quantity',
      render: (qty: number) => <Tag color="red">{qty}</Tag>,
    },
    {
      title: 'Reorder At',
      dataIndex: 'reorder_level',
      key: 'reorder_level',
    },
    {
      title: 'Primary Supplier',
      dataIndex: 'primary_supplier_name',
      key: 'primary_supplier_name',
      render: (text: string) => text || 'N/A',
    },
  ];

  return (
    <Table
      title={() => 'Low Stock Products'}
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="product_id"
      pagination={false}
      size="small"
    />
  );
}
