import { useState } from 'react';
import { Button, Select, Space, Alert, DatePicker } from 'antd';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { usePurchaseHistoryQuery } from '../../api/ReportService';
import { useListProductsQuery } from '../../api/ProductService';
import { useListSuppliersQuery } from '../../api/SupplierService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { PurchaseHistoryItem } from '../../types';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

export function PurchaseHistoryReportPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    start_date: '',
    end_date: '',
    product_id: '',
    supplier_id: '',
  });
  const permissions = useAuthStore((s) => s.permissions);

  const canReadReports = hasPermission(permissions, 'reports', 'read');

  const { data: purchaseHistory, isLoading, error } = usePurchaseHistoryQuery(filters, {
    enabled: canReadReports,
  });
  const { data: products, isLoading: isLoadingProducts } = useListProductsQuery({ pageSize: 9999 });
  const { data: suppliers, isLoading: isLoadingSuppliers } = useListSuppliersQuery(true);

  const handleTableChange: TableProps<PurchaseHistoryItem>['onChange'] = (pagination) => {
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

  const columns: TableProps<PurchaseHistoryItem>['columns'] = [
    { title: 'PO Number', dataIndex: 'po_number', key: 'po_number' },
    { title: 'Supplier', dataIndex: 'supplier_name', key: 'supplier_name' },
    {
      title: 'Purchase Date',
      dataIndex: 'purchase_date',
      key: 'purchase_date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.purchase_date).unix() - dayjs(b.purchase_date).unix(),
    },
    { title: 'Product', dataIndex: 'product_name', key: 'product_name' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost' },
    { title: 'Total Cost', dataIndex: 'total_cost', key: 'total_cost' },
  ];

  if (!canReadReports) {
    return <Alert message="Access Denied" description="You do not have permission to view this report." type="error" showIcon />;
  }

  return (
    <div className="p-4 md:p-0">
      <PageHeader title="Purchase History Report">
        <Button type="primary" onClick={handleExportCSV}>Export to CSV</Button>
      </PageHeader>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <RangePicker onChange={handleDateRangeChange} style={{ width: '100%', maxWidth: 300 }} />
        <Select
          placeholder="Filter by Product"
          onChange={(value) => setFilters(prev => ({ ...prev, product_id: value, page: 1 }))}
          style={{ width: '100%', maxWidth: 200 }}
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
          placeholder="Filter by Supplier"
          onChange={(value) => setFilters(prev => ({ ...prev, supplier_id: value, page: 1 }))}
          style={{ width: '100%', maxWidth: 200 }}
          loading={isLoadingSuppliers}
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {suppliers?.map(supplier => (
            <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
          ))}
        </Select>
      </div>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}
      
      <SharedTable<PurchaseHistoryItem>
        columns={columns}
        dataSource={purchaseHistory?.items || []}
        loading={isLoading}
        pagination={{
          current: filters.page,
          pageSize: filters.pageSize,
          total: purchaseHistory?.total || 0,
        }}
        onChange={handleTableChange}
        rowKey="id"
      />
    </div>
  );
}
