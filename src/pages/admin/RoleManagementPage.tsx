import { useState } from 'react';
import { Button,  Alert, Popconfirm, Modal } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { RoleForm } from '../../components/forms/RoleForm';
import { useListRolesQuery, useDeleteRoleMutation } from '../../api/RoleService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { Role } from '../../types';
import type { TableProps } from 'antd';

export function RoleManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const permissions = useAuthStore((s) => s.permissions);

  const canReadRoles = hasPermission(permissions, 'roles', 'read');
  const canCreateRoles = hasPermission(permissions, 'roles', 'create');
  const canUpdateRoles = hasPermission(permissions, 'roles', 'update');
  const canDeleteRoles = hasPermission(permissions, 'roles', 'delete');

  const { data: roles, isLoading, error } = useListRolesQuery({ enabled: canReadRoles });

  const deleteMutation = useDeleteRoleMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  const handleEdit = (id: string) => {
    setEditingRoleId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCreate = () => {
    setEditingRoleId(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRoleId(undefined);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['roles'] });
    handleModalClose();
  };

  const columns: TableProps<Role>['columns'] = [
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
      title: 'Actions',
      key: 'actions',
      render: (_, record: Role) => (
        <div className="flex flex-col sm:flex-row gap-2">
          {canUpdateRoles && <Button onClick={() => handleEdit(record.id)}>Edit</Button>}
          {canDeleteRoles && (
            <Popconfirm
              title="Delete the role"
              description="Are you sure you want to delete this role?"
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

  if (!canReadRoles) {
    return <Alert message="Access Denied" description="You do not have permission to view this page." type="error" showIcon />;
  }

  return (
    <div className="p-4">
      <PageHeader title="Role Management">
        {canCreateRoles && <Button type="primary" onClick={handleCreate}>Create Role</Button>}
      </PageHeader>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}

      <div className="overflow-x-auto">
        <SharedTable<Role>
          columns={columns}
          dataSource={roles || []}
          loading={isLoading}
        />
      </div>

      <Modal
        title={editingRoleId ? 'Edit Role' : 'Create Role'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
        width={800}
      >
        <RoleForm
          id={editingRoleId}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
