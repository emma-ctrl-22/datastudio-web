import { useState } from 'react';
import { Select, Alert, Tag, DatePicker } from 'antd';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useListStockMovementsQuery } from '../../api/StockService';
import { useListProductsQuery } from '../../api/ProductService';
import type { StockMovement } from '../../types';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export function StockMovementPage() {
  const [filters, setFilters] = useState<{
    page: number;
    pageSize: number;
    product_id: string;
    movement_type: 'in' | 'out' | 'adjustment' | undefined;
    start_date: string;
    end_date: string;
  }>({
    page: 1,
    pageSize: 10,
    product_id: '',
    movement_type: undefined,
    start_date: '',
    end_date: '',
  });

  const { data: stockMovements, isLoading, error } = useListStockMovementsQuery(filters);
  const { data: products, isLoading: isLoadingProducts } = useListProductsQuery({ pageSize: 9999 });

  const handleTableChange: TableProps<StockMovement>['onChange'] = (pagination) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const handleDateRangeChange = (_dates: (dayjs.Dayjs | null)[] | null, dateStrings: [string, string]) => {
    setFilters(prev => ({
      ...prev,
      start_date: dateStrings[0],
      end_date: dateStrings[1],
      page: 1,
    }));
  };

  const columns: TableProps<StockMovement>['columns'] = [
    {
      title: 'Date',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.transaction_date).unix() - dayjs(b.transaction_date).unix(),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product) => `${product.name} (${product.product_code})`,
    },
    {
      title: 'Type',
      dataIndex: 'movement_type',
      key: 'movement_type',
      render: (type: 'in' | 'out' | 'adjustment') => {
        let color = 'blue';
        if (type === 'in') color = 'green';
        if (type === 'out') color = 'red';
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      render: (cost: string) => cost ? `$${parseFloat(cost).toFixed(2)}` : 'N/A',
    },
    {
      title: 'Reference',
      dataIndex: 'reference_number',
      key: 'reference_number',
      render: (ref: string, record: StockMovement) => (
        ref ? `${record.reference_type}: ${ref}` : 'N/A'
      ),
    },
    {
      title: 'Performed By',
      dataIndex: 'performedBy',
      key: 'performedBy',
      render: (user) => user.username,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
  ];

  return (
    <div>
      <PageHeader title="Stock Movement History" />

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Select
          placeholder="Filter by product"
          loading={isLoadingProducts}
          onChange={(value) => setFilters(prev => ({ ...prev, product_id: value, page: 1 }))}
          style={{ width: '100%', maxWidth: 250 }}
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
        <Select
          placeholder="Filter by type"
          onChange={(value: 'in' | 'out' | 'adjustment' | undefined) => setFilters(prev => ({ ...prev, movement_type: value, page: 1 }))}
          style={{ width: '100%', maxWidth: 150 }}
          allowClear
        >
          <Select.Option value="in">In</Select.Option>
          <Select.Option value="out">Out</Select.Option>
          <Select.Option value="adjustment">Adjustment</Select.Option>
        </Select>
        <RangePicker onChange={handleDateRangeChange} style={{ width: '100%', maxWidth: 300 }} />
      </div>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}
      
      <SharedTable<StockMovement>
        columns={columns}
        dataSource={stockMovements?.items || []}
        loading={isLoading}
        pagination={{
          current: filters.page,
          pageSize: filters.pageSize,
          total: stockMovements?.total || 0,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
