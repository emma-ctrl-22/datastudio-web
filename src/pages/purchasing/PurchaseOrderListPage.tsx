import { useState } from 'react';
import { Button, Input, Select, Space, Alert, Popconfirm, Tag, DatePicker } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useListPurchaseOrdersQuery, useDeletePurchaseOrderMutation } from '../../api/PurchaseOrderService';
import { useListSuppliersQuery } from '../../api/SupplierService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { PurchaseOrder } from '../../types';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

const { Search } = Input;
const { RangePicker } = DatePicker;

export function PurchaseOrderListPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    supplier_id: '',
    status: '',
    start_date: '',
    end_date: '',
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const permissions = useAuthStore((s) => s.permissions);

  const canRead = hasPermission(permissions, 'purchase_orders', 'read');
  const canCreate = hasPermission(permissions, 'purchase_orders', 'create');
  const canUpdate = hasPermission(permissions, 'purchase_orders', 'update'); // For 'Receive Goods'
  const canDelete = hasPermission(permissions, 'purchase_orders', 'delete');

  const { data: purchaseOrders, isLoading, error } = useListPurchaseOrdersQuery(filters);
  const { data: suppliers, isLoading: isLoadingSuppliers } = useListSuppliersQuery(true);

  const deleteMutation = useDeletePurchaseOrderMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleTableChange: TableProps<PurchaseOrder>['onChange'] = (pagination) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setFilters(prev => ({
      ...prev,
      start_date: dateStrings[0],
      end_date: dateStrings[1],
      page: 1,
    }));
  };

  const columns: TableProps<PurchaseOrder>['columns'] = [
    {
      title: 'PO Number',
      dataIndex: 'po_number',
      key: 'po_number',
      render: (text, record) => <Link to={`/po/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplier) => supplier.name,
    },
    {
      title: 'Order Date',
      dataIndex: 'order_date',
      key: 'order_date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.order_date).unix() - dayjs(b.order_date).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: PurchaseOrder['status']) => {
        let color: string;
        switch (status) {
          case 'draft': color = 'default'; break;
          case 'sent': color = 'blue'; break;
          case 'part_received': color = 'orange'; break;
          case 'received': color = 'green'; break;
          case 'cancelled': color = 'red'; break;
          default: color = 'default';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Total Lines',
      dataIndex: 'lines',
      key: 'total_lines',
      render: (lines) => lines.length,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: PurchaseOrder) => (
        <Space size="middle">
          {canRead && <Link to={`/po/${record.id}`}>View</Link>}
          {canUpdate && record.status !== 'received' && record.status !== 'cancelled' && (
            <Button type="link" onClick={() => navigate(`/po/${record.id}/receive`)}>Receive Goods</Button>
          )}
          {canDelete && (record.status === 'draft' || record.status === 'cancelled') && (
            <Popconfirm
              title="Delete the purchase order"
              description="Are you sure you want to delete this purchase order?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>Delete</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Purchase Orders">
        {canCreate && <Button type="primary" onClick={() => navigate('/po/new')}>Create Purchase Order</Button>}
      </PageHeader>

      <Space className="mb-4">
        <Select
          placeholder="Filter by supplier"
          loading={isLoadingSuppliers}
          onChange={(value) => setFilters(prev => ({ ...prev, supplier_id: value, page: 1 }))}
          style={{ width: 200 }}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {suppliers?.map(supplier => <Select.Option key={supplier.id} value={supplier.id}>{supplier.name}</Select.Option>)}
        </Select>
        <Select
          placeholder="Filter by status"
          onChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}
          style={{ width: 150 }}
          allowClear
        >
          <Select.Option value="draft">Draft</Select.Option>
          <Select.Option value="sent">Sent</Select.Option>
          <Select.Option value="part_received">Partially Received</Select.Option>
          <Select.Option value="received">Received</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
        </Select>
        <RangePicker onChange={handleDateRangeChange} />
      </Space>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}
      
      <SharedTable<PurchaseOrder>
        columns={columns}
        dataSource={purchaseOrders?.items || []}
        loading={isLoading}
        pagination={{
          current: filters.page,
          pageSize: filters.pageSize,
          total: purchaseOrders?.total || 0,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
