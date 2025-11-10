import { useState } from 'react';
import { Button, Select, Space, Alert, Popconfirm, Tag, DatePicker } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useListDispatchOrdersQuery, useDeleteDispatchOrderMutation, useUpdateDispatchOrderMutation } from '../../api/DispatchOrderService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { DispatchOrder } from '../../types';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import type { RangeValue } from 'rc-picker/lib/interface';

const { RangePicker } = DatePicker;

export function DispatchOrderListPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    recipient_type: '',
    status: '',
    start_date: '',
    end_date: '',
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const permissions = useAuthStore((s) => s.permissions);

  const canRead = hasPermission(permissions, 'dispatches', 'read');
  const canCreate = hasPermission(permissions, 'dispatches', 'create');
  const canUpdate = hasPermission(permissions, 'dispatches', 'update');
  const canDelete = hasPermission(permissions, 'dispatches', 'delete');

  const { data: dispatchOrders, isLoading, error } = useListDispatchOrdersQuery(filters);

  const deleteMutation = useDeleteDispatchOrderMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch-orders'] });
    },
  });

  const updateStatusMutation = useUpdateDispatchOrderMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch-orders'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleTableChange: TableProps<DispatchOrder>['onChange'] = (pagination) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const handleDateRangeChange = (dates: RangeValue<dayjs.Dayjs>, dateStrings: [string, string]) => {
    setFilters(prev => ({
      ...prev,
      start_date: dateStrings[0] || '',
      end_date: dateStrings[1] || '',
      page: 1,
    }));
  };

  const columns: TableProps<DispatchOrder>['columns'] = [
    {
      title: 'Dispatch Number',
      dataIndex: 'dispatch_number',
      key: 'dispatch_number',
      render: (text, record) => <Link to={`/dispatch/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient_name',
      key: 'recipient_name',
    },
    {
      title: 'Dispatch Date',
      dataIndex: 'dispatch_date',
      key: 'dispatch_date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.dispatch_date).unix() - dayjs(b.dispatch_date).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: DispatchOrder['status']) => {
        let color: string;
        switch (status) {
          case 'draft': color = 'default'; break;
          case 'confirmed': color = 'blue'; break;
          case 'dispatched': color = 'purple'; break;
          case 'delivered': color = 'green'; break;
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
      render: (_, record: DispatchOrder) => (
        <Space size="middle">
          {canRead && <Link to={`/dispatch/${record.id}`}>View</Link>}
          {canUpdate && record.status !== 'delivered' && record.status !== 'cancelled' && (
            <Button type="link" onClick={() => navigate(`/dispatch/${record.id}/edit`)}>Edit Status</Button>
          )}
          {canDelete && (record.status === 'draft' || record.status === 'cancelled') && (
            <Popconfirm
              title="Delete the dispatch order"
              description="Are you sure you want to delete this dispatch order?"
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
      <PageHeader title="Dispatch Orders">
        {canCreate && <Button type="primary" onClick={() => navigate('/dispatch/new')}>Create Dispatch Order</Button>}
      </PageHeader>

      <Space className="mb-4">
        <Select
          placeholder="Filter by recipient type"
          onChange={(value) => setFilters(prev => ({ ...prev, recipient_type: value, page: 1 }))}
          style={{ width: 180 }}
          allowClear
        >
          <Select.Option value="hospital">Hospital</Select.Option>
          <Select.Option value="clinic">Clinic</Select.Option>
          <Select.Option value="customer">Customer</Select.Option>
          <Select.Option value="internal">Internal</Select.Option>
        </Select>
        <Select
          placeholder="Filter by status"
          onChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}
          style={{ width: 150 }}
          allowClear
        >
          <Select.Option value="draft">Draft</Select.Option>
          <Select.Option value="confirmed">Confirmed</Select.Option>
          <Select.Option value="dispatched">Dispatched</Select.Option>
          <Select.Option value="delivered">Delivered</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
        </Select>
        <RangePicker onChange={handleDateRangeChange} />
      </Space>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}
      
      <SharedTable<DispatchOrder>
        columns={columns}
        dataSource={dispatchOrders?.items || []}
        loading={isLoading}
        pagination={{
          current: filters.page,
          pageSize: filters.pageSize,
          total: dispatchOrders?.total || 0,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
