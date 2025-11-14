import { useState } from 'react';
import { Button, Select, Space, Alert} from 'antd';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useFastMovingItemsQuery } from '../../api/ReportService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { MoversReportItem } from '../../types';
import type { TableProps } from 'antd';
const { Option } = Select;
type FilterState = {
  page: number;
  pageSize: number;
  time_window?: '30d' | '90d' | '1y';
};

export function FastMovingItemsReportPage() {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    pageSize: 10,
    time_window: '30d', // Default to last 30 days
  });
  const permissions = useAuthStore((s) => s.permissions);

  const canReadReports = hasPermission(permissions, 'reports', 'read');

  const { data: fastMovingItems, isLoading, error } = useFastMovingItemsQuery(filters, {
    enabled: canReadReports,
  });

  const handleTableChange: TableProps<MoversReportItem>['onChange'] = (pagination) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export logic
    alert('CSV Export functionality not yet implemented.');
  };

  const columns: TableProps<MoversReportItem>['columns'] = [
    { title: 'Product Code', dataIndex: 'product_code', key: 'product_code' },
    { title: 'Product Name', dataIndex: 'product_name', key: 'product_name' },
    { title: 'Category', dataIndex: 'category_name', key: 'category_name' },
    { title: 'Quantity Moved', dataIndex: 'total_quantity_moved', key: 'total_quantity_moved' },
  ];

  if (!canReadReports) {
    return <Alert message="Access Denied" description="You do not have permission to view this report." type="error" showIcon />;
  }

  return (
    <div className="p-4 md:p-0">
      <PageHeader title="Fast-Moving Items Report">
        <Button type="primary" onClick={handleExportCSV}>Export to CSV</Button>
      </PageHeader>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Select
          placeholder="Time Window"
          onChange={(value: '30d' | '90d' | '1y' | undefined) => setFilters(prev => ({ ...prev, time_window: value, page: 1 }))}
          value={filters.time_window}
          style={{ width: '100%', maxWidth: 150 }}
        >
          <Option value="30d">Last 30 Days</Option>
          <Option value="90d">Last 90 Days</Option>
          <Option value="1y">Last 1 Year</Option>
        </Select>
      </div>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}
      
      <SharedTable<MoversReportItem>
        columns={columns}
        dataSource={fastMovingItems?.items || []}
        loading={isLoading}
        pagination={{
          current: filters.page,
          pageSize: filters.pageSize,
          total: fastMovingItems?.total || 0,
        }}
        onChange={handleTableChange}
        rowKey="product_id"
      />
    </div>
  );
}
