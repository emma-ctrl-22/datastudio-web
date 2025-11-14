import { useState } from 'react';
import { Button, Space, Popconfirm, Alert,Switch,Modal } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { useListCategoriesQuery, useDeleteCategoryMutation, useUpdateCategoryMutation } from '../../api/ProductService';
import { CategoryForm } from '../../components/forms/CategoryForm';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { Category } from '../../types';
import type { TableProps } from 'antd';

export function CategoryListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const permissions = useAuthStore((s) => s.permissions);

  const canUpdate = hasPermission(permissions, 'products', 'update');
  const canDelete = hasPermission(permissions, 'products', 'delete');
  const canCreate = hasPermission(permissions, 'products', 'create');

  const { data: categories, isLoading, error } = useListCategoriesQuery();

  const deleteMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateStatusMutation = useUpdateCategoryMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleEdit = (id: string) => {
    setEditingCategoryId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCreate = () => {
    setEditingCategoryId(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategoryId(undefined);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    handleModalClose();
  };

  const columns: TableProps<Category>['columns'] = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean, record: Category) => (
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
      render: (_, record: Category) => (
        <div className="flex flex-col sm:flex-row gap-2">
          {canUpdate && <Button onClick={() => handleEdit(record.id)}>Edit</Button>}
          {canDelete && (
            <Popconfirm
              title="Delete the category"
              description="Are you sure you want to delete this category?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <PageHeader title="Categories">
        {canCreate && <Button type="primary" onClick={handleCreate}>Create Category</Button>}
      </PageHeader>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}

      <div className="overflow-x-auto">
        <SharedTable<Category>
          columns={columns}
          dataSource={categories || []}
          loading={isLoading}
        />
      </div>

      <Modal
        title={editingCategoryId ? 'Edit Category' : 'Create Category'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        <CategoryForm
          id={editingCategoryId}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
