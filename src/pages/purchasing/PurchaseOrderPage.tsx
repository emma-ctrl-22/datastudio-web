import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, Space, Card,  InputNumber, Alert, Tag,Row,Col,Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { PageHeader } from '../../components/shared/PageHeader';
import {
  useGetPurchaseOrderQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
} from '../../api/PurchaseOrderService';
import { useListSuppliersQuery } from '../../api/SupplierService';
import { useListProductsQuery } from '../../api/ProductService';
import { hasPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/auth';
import type { CreatePurchaseOrderPayload, UpdatePurchaseOrderPayload } from '../../types';

const { Option } = Select;

export function PurchaseOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const permissions = useAuthStore((s) => s.permissions);

  const isEditMode = !!id;

  const canUpdate = hasPermission(permissions, 'purchase_orders', 'update');


  const { data: purchaseOrder, isLoading: isLoadingPO, error: poError } = useGetPurchaseOrderQuery(id!, {
    enabled: isEditMode,
  });
  const { data: suppliers, isLoading: isLoadingSuppliers } = useListSuppliersQuery(true);
  const { data: products, isLoading: isLoadingProducts } = useListProductsQuery({ pageSize: 9999 });

  const createMutation = useCreatePurchaseOrderMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      navigate('/po');
    },
  });

  const updateMutation = useUpdatePurchaseOrderMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      navigate('/po');
    },
  });

  useEffect(() => {
    if (isEditMode && purchaseOrder) {
      form.setFieldsValue({
        ...purchaseOrder,
        supplier_id: purchaseOrder.supplier.id,
        order_date: dayjs(purchaseOrder.order_date),
        lines: purchaseOrder.lines.map((line) => ({
          ...line,
          product_id: line.product.id,
        })),
      });
    }
  }, [purchaseOrder, isEditMode, form]);

  const onFinish = (values: any) => {
    if (isEditMode) {
      const updatePayload: UpdatePurchaseOrderPayload = {
        status: values.status,
        sent_date: values.sent_date?.format('YYYY-MM-DD'),
        notes: values.notes,
      };
      updateMutation.mutate({ id: id!, payload: updatePayload });
    } else {
      const createPayload: CreatePurchaseOrderPayload = {
        po_number: values.po_number,
        supplier_id: values.supplier_id,
        order_date: values.order_date.format('YYYY-MM-DD'),
        notes: values.notes,
        lines: values.lines.map((line: any, index: number) => ({
          line_number: index + 1,
          product_id: line.product_id,
          quantity_ordered: line.quantity_ordered,
          unit_cost: String(line.unit_cost),
        })),
      };
      createMutation.mutate(createPayload);
    }
  };

  if (isLoadingPO) {
    return <Spin tip="Loading purchase order..." />;
  }

  if (poError) {
    return <Alert message="Error" description={poError.message} type="error" showIcon />;
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isViewing = isEditMode && !canUpdate; // If in edit mode but no update permission, it's view-only

  return (
    <div>
      <PageHeader title={isEditMode ? `Purchase Order: ${purchaseOrder?.po_number}` : 'Create Purchase Order'} />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isLoading || isViewing}
          initialValues={{
            order_date: dayjs(),
            lines: [{ product_id: undefined, quantity_ordered: 1, unit_cost: 0 }],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="po_number" label="PO Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplier_id" label="Supplier" rules={[{ required: true }]}>
                <Select loading={isLoadingSuppliers} placeholder="Select a supplier">
                  {suppliers?.map((supplier) => (
                    <Option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="order_date" label="Order Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                <Tag color="blue">{purchaseOrder?.status.toUpperCase() || 'DRAFT'}</Tag>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>

          <h3>Order Lines</h3>
          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'product_id']}
                      rules={[{ required: true, message: 'Missing product' }]}
                      style={{ width: 250 }}
                    >
                      <Select loading={isLoadingProducts} placeholder="Select product" showSearch optionFilterProp="children">
                        {products?.items.map((product) => (
                          <Option key={product.id} value={product.id}>
                            {product.name} ({product.product_code})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity_ordered']}
                      rules={[{ required: true, message: 'Missing quantity' }]}
                    >
                      <InputNumber min={1} placeholder="Quantity" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'unit_cost']}
                      rules={[{ required: true, message: 'Missing unit cost' }]}
                    >
                      <InputNumber min={0} precision={4} placeholder="Unit Cost" />
                    </Form.Item>
                    {!isViewing && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                ))}
                {!isViewing && (
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
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {isEditMode ? 'Update Purchase Order' : 'Create Purchase Order'}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/po')} disabled={isLoading}>
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
