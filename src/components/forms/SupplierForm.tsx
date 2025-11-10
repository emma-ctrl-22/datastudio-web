import { useEffect } from 'react';
import { Form, Input, Button, Switch, Spin, Alert } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useGetSupplierQuery, useCreateSupplierMutation, useUpdateSupplierMutation } from '../../api/SupplierService';
import type { CreateSupplierPayload, UpdateSupplierPayload } from '../../types';

type SupplierFormProps = {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export function SupplierForm({ id, onSuccess, onCancel }: SupplierFormProps) {
  const [form] = useForm();
  const isEditMode = !!id;

  const { data: supplier, isLoading: isLoadingSupplier, error: supplierError } = useGetSupplierQuery(id!, {
    enabled: isEditMode,
  });

  const createMutation = useCreateSupplierMutation({
    onSuccess,
  });
  const updateMutation = useUpdateSupplierMutation({
    onSuccess,
  });

  useEffect(() => {
    if (isEditMode && supplier) {
      form.setFieldsValue(supplier);
    }
  }, [supplier, isEditMode, form]);

  const onFinish = (values: CreateSupplierPayload | UpdateSupplierPayload) => {
    if (isEditMode) {
      updateMutation.mutate({ id: id!, payload: values });
    } else {
      createMutation.mutate(values as CreateSupplierPayload);
    }
  };

  if (isLoadingSupplier) {
    return <Spin tip="Loading supplier..." />;
  }

  if (supplierError) {
    return <Alert message="Error" description={supplierError.message} type="error" showIcon />;
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} disabled={isLoading}>
      <Form.Item name="supplier_code" label="Supplier Code" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="Supplier Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="contact_person" label="Contact Person">
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone">
        <Input />
      </Form.Item>
      <Form.Item name="address" label="Address">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="is_active" label="Active" valuePropName="checked" initialValue={true}>
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {isEditMode ? 'Update Supplier' : 'Create Supplier'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </Form.Item>
      {(createMutation.error || updateMutation.error) && (
        <Form.Item>
          <Alert message="Error" description={createMutation.error?.message || updateMutation.error?.message} type="error" showIcon />
        </Form.Item>
      )}
    </Form>
  );
}
