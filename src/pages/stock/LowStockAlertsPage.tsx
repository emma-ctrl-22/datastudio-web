import { Alert, Tag } from 'antd';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useLowStockAlertsQuery } from '../../api/ReportService';
import type { LowStockAlert } from '../../types';
import type { TableProps } from 'antd';

export function LowStockAlertsPage() {
  const { data: lowStockAlerts, isLoading, error } = useLowStockAlertsQuery();

  const columns: TableProps<LowStockAlert>['columns'] = [
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
      sorter: (a, b) => a.reorder_level - b.reorder_level,
    },
    {
      title: 'Shortfall',
      dataIndex: 'shortfall',
      key: 'shortfall',
      render: (shortfall: number) => <Tag color="red">{shortfall}</Tag>,
      sorter: (a, b) => a.shortfall - b.shortfall,
    },
  ];

  return (
    <div>
      <PageHeader title="Low Stock Alerts" />

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}
      
      <SharedTable<LowStockAlert>
        columns={columns}
        dataSource={lowStockAlerts?.map(alert => ({ ...alert, id: alert.product_id })) || []}
        loading={isLoading}
        pagination={false} // No pagination for this report, as it's a summary
      />
    </div>
  );
}
