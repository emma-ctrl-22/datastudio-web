import { useState } from 'react';
import { Select, Alert, Tag ,Space} from 'antd';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useCurrentStockLevelsQuery } from '../../api/StockService';
import { useListProductsQuery } from '../../api/ProductService'; // To get product names for filter
import type { StockBalance } from '../../types';
import type { TableProps } from 'antd';

const { Option } = Select;

export function StockBalancePage() {
  const [filters, setFilters] = useState({ product_id: '' });

  const { data: stockBalances, isLoading, error } = useCurrentStockLevelsQuery(filters);
  const { data: products, isLoading: isLoadingProducts } = useListProductsQuery({ pageSize: 9999 }); // Fetch all products for filter dropdown

  const columns: TableProps<StockBalance>['columns'] = [
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Current Quantity',
      dataIndex: 'current_quantity',
      key: 'current_quantity',
      sorter: (a, b) => a.current_quantity - b.current_quantity,
    },
    {
      title: 'Reorder Level',
      dataIndex: 'reorder_level',
      key: 'reorder_level',
      render: (level: number, record: StockBalance) => (
        <Tag color={record.below_reorder_level ? 'red' : 'green'}>
          {level}
        </Tag>
      ),
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      render: (value: string) => `$${parseFloat(value).toFixed(2)}`,
      sorter: (a, b) => parseFloat(a.total_value) - parseFloat(b.total_value),
    },
    {
      title: 'Average Cost',
      dataIndex: 'average_cost',
      key: 'average_cost',
      render: (value: string) => `$${parseFloat(value).toFixed(2)}`,
      sorter: (a, b) => parseFloat(a.average_cost) - parseFloat(b.average_cost),
    },
    {
      title: 'Last Movement',
      dataIndex: 'last_movement_date',
      key: 'last_movement_date',
      render: (date: string | null) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
  ];

  return (
    <div>
      <PageHeader title="Current Stock Levels" />

      <Space className="mb-4">
        <Select
          placeholder="Filter by product"
          loading={isLoadingProducts}
          onChange={(value) => setFilters(prev => ({ ...prev, product_id: value }))}
          style={{ width: 250 }}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => {
            const childrenText = String(option?.children || '');
            return childrenText.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
        >
          {products?.items.map(product => <Select.Option key={product.id} value={product.id}>{product.name} ({product.product_code})</Select.Option>)}
        </Select>
      </Space>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}
      
      <SharedTable<StockBalance>
        columns={columns}
        dataSource={stockBalances?.map(balance => ({ ...balance, id: balance.product_id })) || []}
        loading={isLoading}
        pagination={false} // No pagination for this report, as it's a summary
      />
    </div>
  );
}
