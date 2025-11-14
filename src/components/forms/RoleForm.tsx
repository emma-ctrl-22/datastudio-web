import { useEffect } from 'react';
import { Form, Input, Button, Spin, Alert, Checkbox, Row, Col } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCreateRoleMutation, useUpdateRoleMutation, useListPermissionsQuery, useGetRoleQuery } from '../../api/RoleService';
import type { CreateRolePayload, UpdateRolePayload } from '../../types';

type RoleFormProps = {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export function RoleForm({ id, onSuccess, onCancel }: RoleFormProps) {
  const [form] = useForm();
  const isEditMode = !!id;

  const { data: role, isLoading: isLoadingRole } = useGetRoleQuery(id!, { enabled: isEditMode });
  const { data: permissions, isLoading: isLoadingPermissions } = useListPermissionsQuery();

  const createMutation = useCreateRoleMutation({
    onSuccess,
  });
  const updateMutation = useUpdateRoleMutation({
    onSuccess,
  });

  useEffect(() => {
    if (isEditMode && role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        permissions: role.permissions.map(p => p.id),
      });
    }
  }, [role, isEditMode, form]);

  const onFinish = (values: CreateRolePayload | UpdateRolePayload) => {
    if (isEditMode) {
      updateMutation.mutate({ id: id!, payload: values });
    } else {
      createMutation.mutate(values as CreateRolePayload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (isLoadingRole || isLoadingPermissions) {
    return <Spin />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} disabled={isLoading}>
      <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="permissions" label="Permissions">
        <Checkbox.Group style={{ width: '100%' }}>
          <Row gutter={[16, 8]}>
            {permissions?.map(p => (
              <Col xs={24} sm={12} md={8} key={p.id}>
                <Checkbox value={p.id}>{`${p.resource}: ${p.action}`}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            {isEditMode ? 'Update Role' : 'Create Role'}
          </Button>
          <Button onClick={onCancel} disabled={isLoading} block>
            Cancel
          </Button>
        </div>
      </Form.Item>
      {(createMutation.error || updateMutation.error) && (
        <Form.Item>
          <Alert message="Error" description={createMutation.error?.message || updateMutation.error?.message} type="error" showIcon />
        </Form.Item>
      )}
    </Form>
  );
}
