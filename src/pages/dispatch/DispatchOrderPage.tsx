import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, Space, Card, InputNumber, Alert, Tag, Row, Col, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { PageHeader } from '../../components/shared/PageHeader';
import {
  useGetDispatchOrderQuery,
  useCreateDispatchOrderMutation,
  useUpdateDispatchOrderMutation,
} from '../../api/DispatchOrderService';
import { useListProductsQuery } from '../../api/ProductService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { CreateDispatchOrderPayload, UpdateDispatchOrderPayload } from '../../types';

const { Option } = Select;

export function DispatchOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const permissions = useAuthStore((s) => s.permissions);

  const isEditMode = !!id;

  const canUpdate = hasPermission(permissions, 'dispatches', 'update');

  const { data: dispatchOrder, isLoading: isLoadingDO, error: doError } = useGetDispatchOrderQuery(id!, {
    enabled: isEditMode,
  });
  const { data: products, isLoading: isLoadingProducts } = useListProductsQuery({ pageSize: 9999, is_active: true });

  const createMutation = useCreateDispatchOrderMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch-orders'] });
      navigate('/dispatch');
    },
  });

  const updateMutation = useUpdateDispatchOrderMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch-orders'] });
      queryClient.invalidateQueries({ queryKey: ['dispatch-order', id] });
      navigate('/dispatch');
    },
  });

  useEffect(() => {
    if (isEditMode && dispatchOrder) {
      form.setFieldsValue({
        ...dispatchOrder,
        dispatch_date: dayjs(dispatchOrder.dispatch_date),
        lines: dispatchOrder.lines.map((line) => ({
          ...line,
          product_id: line.product.id,
        })),
      });
    }
  }, [dispatchOrder, isEditMode, form]);

  const onFinish = (values: any) => {
    if (isEditMode) {
      const payload: UpdateDispatchOrderPayload = {
        recipient_name: values.recipient_name,
        recipient_type: values.recipient_type,
        contact_phone: values.contact_phone,
        delivery_address: values.delivery_address,
        dispatch_date: dayjs(values.dispatch_date).format('YYYY-MM-DD'),
        notes: values.notes,
        status: values.status,
      };
      updateMutation.mutate({ id: id!, payload });
    } else {
      const payload: CreateDispatchOrderPayload = {
        dispatch_number: values.dispatch_number,
        recipient_name: values.recipient_name,
        recipient_type: values.recipient_type,
        contact_phone: values.contact_phone,
        delivery_address: values.delivery_address,
        dispatch_date: dayjs(values.dispatch_date).format('YYYY-MM-DD'),
        notes: values.notes,
        lines: values.lines.map((line: { product_id: string; quantity: number }, index: number) => ({
          line_number: index + 1,
          product_id: line.product_id,
          quantity: line.quantity,
        })),
      };
      createMutation.mutate(payload);
    }
  };

  if (isLoadingDO) {
    return <Spin tip="Loading dispatch order..." />;
  }

  if (doError) {
    return <Alert message="Error" description={doError.message} type="error" showIcon />;
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isViewing = isEditMode && !canUpdate;

  return (
    <div>
      <PageHeader title={isEditMode ? `Dispatch Order: ${dispatchOrder?.dispatch_number}` : 'Create Dispatch Order'} />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isLoading || isViewing}
          initialValues={{
            dispatch_date: dayjs(),
            recipient_type: 'customer',
            status: 'draft',
            lines: [{ product_id: undefined, quantity: 1 }],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dispatch_number" label="Dispatch Number" rules={[{ required: true }]}>
                <Input disabled={isEditMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="recipient_name" label="Recipient Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="recipient_type" label="Recipient Type">
                <Select>
                  <Option value="hospital">Hospital</Option>
                  <Option value="clinic">Clinic</Option>
                  <Option value="customer">Customer</Option>
                  <Option value="internal">Internal</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contact_phone" label="Contact Phone">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="delivery_address" label="Delivery Address">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dispatch_date" label="Dispatch Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                {isEditMode && canUpdate ? (
                  <Select placeholder="Change status">
                    <Option value="draft">Draft</Option>
                    <Option value="confirmed">Confirmed</Option>
                    <Option value="dispatched">Dispatched</Option>
                    <Option value="delivered">Delivered</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                ) : (
                  <Tag color="blue">{form.getFieldValue('status')?.toUpperCase() || 'DRAFT'}</Tag>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>

          <h3>Dispatch Lines</h3>
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'product_id']}
                      rules={[{ required: true, message: 'Missing product' }]}
                      style={{ width: 400 }}
                    >
                      <Select
                        loading={isLoadingProducts}
                        placeholder="Select product"
                        showSearch
                        optionFilterProp="children"
                        disabled={isEditMode}
                      >
                        {products?.items.map((product) => (
                          <Option key={product.id} value={product.id}>
                            {product.name} ({product.product_code})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Missing quantity' }]}
                    >
                      <InputNumber min={1} placeholder="Quantity" disabled={isEditMode} />
                    </Form.Item>
                    {!isViewing && !isEditMode && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                ))}
                {!isViewing && !isEditMode && (
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Line
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>

          <Form.Item>
            {!isViewing && (
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {isEditMode ? 'Update Dispatch Order' : 'Create Dispatch Order'}
              </Button>
            )}
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/dispatch')} disabled={isLoading}>
              Cancel
            </Button>
          </Form.Item>
          {(createMutation.error || updateMutation.error) && (
            <Form.Item>
              <Alert message="Error" description={createMutation.error?.message || updateMutation.error?.message} type="error" showIcon />
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
}
