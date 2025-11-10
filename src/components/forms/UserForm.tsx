import { useEffect } from 'react';
import { Form, Input, Button, Select, Spin, Alert } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCreateUserMutation } from '../../api/UserService';
import { useListRolesQuery } from '../../api/RoleService';
import type { CreateUserPayload } from '../../types';

const { Option } = Select;

type UserFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export function UserForm({ onSuccess, onCancel }: UserFormProps) {
  const [form] = useForm();

  const { data: roles, isLoading: isLoadingRoles } = useListRolesQuery();

  const createMutation = useCreateUserMutation({
    onSuccess,
  });

  const onFinish = (values: CreateUserPayload) => {
    createMutation.mutate(values);
  };

  const isLoading = createMutation.isPending;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} disabled={isLoading}>
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="roles" label="Roles">
        <Select mode="multiple" placeholder="Select roles" loading={isLoadingRoles}>
          {roles?.map(role => (
            <Option key={role.id} value={role.name}>
              {role.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Create User
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </Form.Item>
      {createMutation.error && (
        <Form.Item>
          <Alert message="Error" description={createMutation.error?.message} type="error" showIcon />
        </Form.Item>
      )}
    </Form>
  );
}
