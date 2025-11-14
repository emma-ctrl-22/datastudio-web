import { useState } from 'react';
import { Button, Space, Switch, Alert, Popconfirm } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useListSuppliersQuery, useDeleteSupplierMutation, useUpdateSupplierMutation } from '../../api/SupplierService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { Supplier } from '../../types';
import type { TableProps } from 'antd';




export function SupplierListPage() {
  const [filters, setFilters] = useState({ activeOnly: false });
  console.log('SupplierListPage filters:', filters, setFilters);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const permissions = useAuthStore((s) => s.permissions);

  const canUpdate = hasPermission(permissions, 'suppliers', 'update');
  const canDelete = hasPermission(permissions, 'suppliers', 'delete');
  const canCreate = hasPermission(permissions, 'suppliers', 'create');

  const { data: suppliers, isLoading, error } = useListSuppliersQuery(filters.activeOnly);

  const deleteMutation = useDeleteSupplierMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });

  const updateStatusMutation = useUpdateSupplierMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columns: TableProps<Supplier>['columns'] = [
    {
      title: 'Code',
      dataIndex: 'supplier_code',
      key: 'supplier_code',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/suppliers/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Contact Person',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean, record: Supplier) => (
        <Switch
          checked={isActive}
          onChange={(checked) => updateStatusMutation.mutate({ id: record.id, payload: { is_active: checked } })}
          disabled={!canUpdate || updateStatusMutation.isPending}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Supplier) => (
        <Space size="middle">
          <Link to={`/suppliers/${record.id}`}>View</Link>
          {canUpdate && <Link to={`/suppliers/${record.id}/edit`}>Edit</Link>}
          {canDelete && (
            <Popconfirm
              title="Delete the supplier"
              description="Are you sure you want to delete this supplier?"
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
    <div className="p-4 md:p-0">
      <PageHeader title="Suppliers">
        {canCreate && <Button type="primary" onClick={() => navigate('/suppliers/new')}>Create Supplier</Button>}
      </PageHeader>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}

      <SharedTable<Supplier>
        columns={columns}
        dataSource={suppliers || []}
        loading={isLoading}
        pagination={false} // Assuming suppliers list is not paginated for now
      />
    </div>
  );
}
