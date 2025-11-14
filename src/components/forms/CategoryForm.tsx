import { useEffect } from 'react';
import { Form, Input, Button, Switch, Spin, Alert } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useGetCategoryQuery, useCreateCategoryMutation, useUpdateCategoryMutation } from '../../api/ProductService';
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../../types';

type CategoryFormProps = {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export function CategoryForm({ id, onSuccess, onCancel }: CategoryFormProps) {
  const [form] = useForm();
  const isEditMode = !!id;

  const { data: category, isLoading: isLoadingCategory, error: categoryError } = useGetCategoryQuery(id!, {
    enabled: isEditMode,
  });

  const createMutation = useCreateCategoryMutation({
    onSuccess,
  });
  const updateMutation = useUpdateCategoryMutation({
    onSuccess,
  });

  useEffect(() => {
    if (isEditMode && category) {
      form.setFieldsValue(category);
    }
  }, [category, isEditMode, form]);

  const onFinish = (values: CreateCategoryPayload | UpdateCategoryPayload) => {
    if (isEditMode) {
      updateMutation.mutate({ id: id!, payload: values });
    } else {
      createMutation.mutate(values as CreateCategoryPayload);
    }
  };

  if (isLoadingCategory) {
    return <Spin tip="Loading category..." />;
  }

  if (categoryError) {
    return <Alert message="Error" description={(categoryError as Error).message} type="error" showIcon />;
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} disabled={isLoading}>
      <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="is_active" label="Active" valuePropName="checked" initialValue={true}>
        <Switch />
      </Form.Item>
      <Form.Item>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            {isEditMode ? 'Update Category' : 'Create Category'}
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
