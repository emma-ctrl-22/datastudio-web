import { useState } from 'react';
import { Button, Input, Select, Space, Switch, Tag, Alert, Popconfirm } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useListProductsQuery, useDeleteProductMutation, useUpdateProductMutation, useListCategoriesQuery } from '../../api/ProductService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { Product } from '../../types';
import type { TableProps } from 'antd';

const { Search } = Input;

export function ProductListPage() {
  const [filters, setFilters] = useState({ page: 1, pageSize: 10, search: '', category_id: '' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const permissions = useAuthStore((s) => s.permissions);

  const canUpdate = hasPermission(permissions, 'products', 'update');
  const canDelete = hasPermission(permissions, 'products', 'delete');
  const canCreate = hasPermission(permissions, 'products', 'create');

  const { data, isLoading, error } = useListProductsQuery(filters);
  const { data: categories, isLoading: isLoadingCategories } = useListCategoriesQuery(true);

  const deleteMutation = useDeleteProductMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateStatusMutation = useUpdateProductMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleTableChange: TableProps<Product>['onChange'] = (pagination) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Code',
      dataIndex: 'product_code',
      key: 'product_code',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category?.name || <Tag>None</Tag>,
    },
    {
      title: 'UoM',
      dataIndex: 'unit_of_measure',
      key: 'unit_of_measure',
    },
    {
      title: 'Reorder Level',
      dataIndex: 'reorder_level',
      key: 'reorder_level',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean, record: Product) => (
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
      render: (_, record: Product) => (
        <div className="flex flex-col sm:flex-row gap-2">
          {canUpdate && <Link to={`/products/${record.id}/edit`}>Edit</Link>}
          {canDelete && (
            <Popconfirm
              title="Delete the product"
              description="Are you sure you want to delete this product?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>Delete</Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <PageHeader title="Products">
        {canCreate && <Button type="primary" onClick={() => navigate('/products/new')}>Create Product</Button>}
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Search
          placeholder="Search by name or code"
          onSearch={(value) => setFilters(prev => ({ ...prev, search: value, page: 1 }))}
          style={{ width: '100%', maxWidth: 250 }}
          allowClear
        />
        <Select
          placeholder="Filter by category"
          loading={isLoadingCategories}
          onChange={(value) => setFilters(prev => ({ ...prev, category_id: value, page: 1 }))}
          style={{ width: '100%', maxWidth: 200 }}
          allowClear
        >
          {categories?.map(cat => <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>)}
        </Select>
      </div>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}

      <div className="overflow-x-auto">
        <SharedTable<Product>
          columns={columns}
          dataSource={data?.items || []}
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: data?.total || 0,
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}
