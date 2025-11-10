import { useState } from 'react';
import { Button,  Select, Space, Alert, DatePicker } from 'antd';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useDispatchHistoryQuery } from '../../api/ReportService';
import { useListProductsQuery } from '../../api/ProductService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { DispatchHistoryItem } from '../../types';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

export function DispatchHistoryReportPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    start_date: '',
    end_date: '',
    product_id: '',
    recipient_type: '',
  });
  const permissions = useAuthStore((s) => s.permissions);

  const canReadReports = hasPermission(permissions, 'reports', 'read');

  const { data: dispatchHistory, isLoading, error } = useDispatchHistoryQuery(filters, {
    enabled: canReadReports,
  });
  const { data: products, isLoading: isLoadingProducts } = useListProductsQuery({ pageSize: 9999 });

  const handleTableChange: TableProps<DispatchHistoryItem>['onChange'] = (pagination) => {
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

  const handleExportCSV = () => {
    // TODO: Implement CSV export logic
    alert('CSV Export functionality not yet implemented.');
  };

  const columns: TableProps<DispatchHistoryItem>['columns'] = [
    { title: 'Dispatch Number', dataIndex: 'dispatch_number', key: 'dispatch_number' },
    { title: 'Recipient', dataIndex: 'recipient_name', key: 'recipient_name' },
    {
      title: 'Dispatch Date',
      dataIndex: 'dispatch_date',
      key: 'dispatch_date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.dispatch_date).unix() - dayjs(b.dispatch_date).unix(),
    },
    { title: 'Product', dataIndex: 'product_name', key: 'product_name' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  ];

  if (!canReadReports) {
    return <Alert message="Access Denied" description="You do not have permission to view this report." type="error" showIcon />;
  }

  return (
    <div>
      <PageHeader title="Dispatch History Report">
        <Button type="primary" onClick={handleExportCSV}>Export to CSV</Button>
      </PageHeader>

      <Space className="mb-4">
        <RangePicker onChange={handleDateRangeChange} />
        <Select
          placeholder="Filter by Product"
          onChange={(value) => setFilters(prev => ({ ...prev, product_id: value, page: 1 }))}
          style={{ width: 200 }}
          loading={isLoadingProducts}
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {products?.items.map(product => (
            <Option key={product.id} value={product.id}>{product.name}</Option>
          ))}
        </Select>
        <Select
          placeholder="Filter by Recipient Type"
          onChange={(value) => setFilters(prev => ({ ...prev, recipient_type: value, page: 1 }))}
          style={{ width: 180 }}
          allowClear
        >
          <Option value="hospital">Hospital</Option>
          <Option value="clinic">Clinic</Option>
          <Option value="customer">Customer</Option>
          <Option value="internal">Internal</Option>
        </Select>
      </Space>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}
      
      <SharedTable<DispatchHistoryItem>
        columns={columns}
        dataSource={dispatchHistory?.items || []}
        loading={isLoading}
        pagination={{
          current: filters.page,
          pageSize: filters.pageSize,
          total: dispatchHistory?.total || 0,
        }}
        onChange={handleTableChange}
        rowKey="id"
      />
    </div>
  );
}
