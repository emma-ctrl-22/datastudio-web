import { useState } from 'react';
import { Button, Select,Alert, Popconfirm, Tag, Modal, Form } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { SharedTable } from '../../components/shared/SharedTable';
import { UserForm } from '../../components/forms/UserForm';
import {
  useListUsersQuery,
  useDeactivateUserMutation,
  useReactivateUserMutation,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  // useCreateUserMutation,
} from '../../api/UserService';
import { useListRolesQuery } from '../../api/RoleService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { UserListItem, Role } from '../../types';
import type { TableProps } from 'antd';

const { Option } = Select;

export function UserManagementPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
  });
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserListItem | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [roleForm] = Form.useForm();

  const queryClient = useQueryClient();
  const permissions = useAuthStore((s) => s.permissions);

  const canReadUsers = hasPermission(permissions, 'users', 'read');
  const canCreateUsers = hasPermission(permissions, 'users', 'create');
  const canUpdateUsers = hasPermission(permissions, 'users', 'update');
  const canManageRoles = hasPermission(permissions, 'roles', 'update');

  const { data: users, isLoading, error } = useListUsersQuery(filters.page, filters.pageSize, {
    enabled: canReadUsers,
    queryKey: ['users', filters.page, filters.pageSize],
  });

  const { data: availableRoles, isLoading: isLoadingRoles } = useListRolesQuery({
    enabled: canManageRoles && (isRoleModalVisible || isUserModalVisible),
  });

  // const createUserMutation = useCreateUserMutation({
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['users'] });
  //     setIsUserModalVisible(false);
  //   },
  // });

  const deactivateUserMutation = useDeactivateUserMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const reactivateUserMutation = useReactivateUserMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const assignRoleMutation = useAssignRoleMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsRoleModalVisible(false);
    },
  });

  const removeRoleMutation = useRemoveRoleMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsRoleModalVisible(false);
    },
  });

  const handleTableChange: TableProps<UserListItem>['onChange'] = (pagination) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const handleToggleUserStatus = (user: UserListItem) => {
    if (user.is_active) {
      deactivateUserMutation.mutate(user.id);
    } else {
      reactivateUserMutation.mutate(user.id);
    }
  };

  const handleEditRoles = (user: UserListItem) => {
    setCurrentUser(user);
    setSelectedRoles(user.roles.map((role: Role) => role.name));
    roleForm.setFieldsValue({ roles: user.roles.map((role: Role) => role.name) });
    setIsRoleModalVisible(true);
  };

  const handleRoleModalOk = () => {
    if (!currentUser) return;
    const currentRoleNames = currentUser.roles.map((role: Role) => role.name);

    const rolesToAdd = selectedRoles.filter((roleName: string) => !currentRoleNames.includes(roleName));
    rolesToAdd.forEach((roleName: string) => {
      assignRoleMutation.mutate({ id: currentUser.id, payload: { roleName } });
    });

    const rolesToRemove = currentRoleNames.filter((roleName: string) => !selectedRoles.includes(roleName));
    rolesToRemove.forEach((roleName: string) => {
      removeRoleMutation.mutate({ id: currentUser.id, roleName });
    });
  };

  const handleRoleModalCancel = () => {
    setIsRoleModalVisible(false);
    setCurrentUser(null);
    setSelectedRoles([]);
  };

  const handleUserModalCancel = () => {
    setIsUserModalVisible(false);
  };

  const columns: TableProps<UserListItem>['columns'] = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'green' : 'red'}>{is_active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: Role[]) => (
        <div className="flex flex-wrap gap-1">
          {roles.map((role: Role) => (
            <Tag key={role.id}>{role.name}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: UserListItem) => (
        <div className="flex flex-col sm:flex-row gap-2">
          {canManageRoles && (
            <Button type="link" onClick={() => handleEditRoles(record)}>Edit Roles</Button>
          )}
          {canUpdateUsers && (
            <Popconfirm
              title={`Are you sure you want to ${record.is_active ? 'deactivate' : 'reactivate'} this user?`}
              onConfirm={() => handleToggleUserStatus(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger={record.is_active}>
                {record.is_active ? 'Deactivate' : 'Reactivate'}
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  if (!canReadUsers) {
    return <Alert message="Access Denied" description="You do not have permission to view this page." type="error" showIcon />;
  }

  return (
    <div className="p-4">
      <PageHeader title="User Management">
        <div className="flex flex-col sm:flex-row gap-2">
          {canCreateUsers && (
            <Button type="primary" onClick={() => setIsUserModalVisible(true)}>
              Create User
            </Button>
          )}
          {hasPermission(permissions, 'roles', 'read') && (
            <Button onClick={() => navigate('/admin/roles')}>
              Manage Roles
            </Button>
          )}
        </div>
      </PageHeader>

      {error && <Alert message="Error" description={error.message} type="error" showIcon className="mb-4" />}

      <div className="overflow-x-auto">
        <SharedTable<UserListItem>
          columns={columns}
          dataSource={users?.items || []}
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: users?.total || 0,
          }}
          onChange={handleTableChange}
        />
      </div>

      <Modal
        title={`Edit Roles for ${currentUser?.username}`}
        open={isRoleModalVisible}
        onOk={handleRoleModalOk}
        onCancel={handleRoleModalCancel}
        confirmLoading={assignRoleMutation.isPending || removeRoleMutation.isPending}
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item name="roles" label="Roles">
            <Select
              mode="multiple"
              placeholder="Select roles"
              value={selectedRoles}
              onChange={setSelectedRoles}
              style={{ width: '100%' }}
              loading={isLoadingRoles}
            >
              {availableRoles?.map((role: Role) => (
                <Option key={role.id} value={role.name}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Create User"
        open={isUserModalVisible}
        onCancel={handleUserModalCancel}
        footer={null}
        destroyOnClose
      >
        <UserForm onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          setIsUserModalVisible(false);
        }} onCancel={handleUserModalCancel} />
      </Modal>
    </div>
  );
}
