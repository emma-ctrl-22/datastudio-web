import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Card, InputNumber, Alert ,Spin,Row,Col,Table} from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { PageHeader } from '../../components/shared/PageHeader';
import { useGetPurchaseOrderQuery } from '../../api/PurchaseOrderService';
import { useCreateGoodsReceiptMutation } from '../../api/GoodsReceiptService';
import type { CreateGoodsReceiptPayload } from '../../types';

export function GoodsReceiptPage() {
  const { id: poId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: purchaseOrder, isLoading: isLoadingPO, error: poError } = useGetPurchaseOrderQuery(poId!, {
    enabled: !!poId,
  });

  const createGRNMutation = useCreateGoodsReceiptMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order', poId] });
      navigate(`/po/${poId}`);
    },
  });

  useEffect(() => {
    if (purchaseOrder) {
      form.setFieldsValue({
        purchase_order_id: purchaseOrder.id,
        received_date: dayjs(),
        lines: purchaseOrder.lines.map((line) => ({
          po_line_id: line.id,
          product_id: line.product.id,
          product_name: line.product.name,
          quantity_ordered: line.quantity_ordered,
          quantity_received: 0, // Default to 0
          unit_cost: line.unit_cost,
        })),
      });
    }
  }, [purchaseOrder, form]);

  const onFinish = (values: any) => {
    const payload: CreateGoodsReceiptPayload = {
      grn_number: values.grn_number,
      purchase_order_id: poId!,
      received_date: values.received_date.format('YYYY-MM-DD'),
      notes: values.notes,
      lines: values.lines
        .filter((line: any) => line.quantity_received > 0) // Only include lines with received quantity
        .map((line: any) => ({
          po_line_id: line.po_line_id,
          product_id: line.product_id,
          quantity_received: line.quantity_received,
          unit_cost: String(line.unit_cost),
          batch_number: line.batch_number,
          serial_number: line.serial_number,
          expiry_date: line.expiry_date?.format('YYYY-MM-DD'),
        })),
    };
    createGRNMutation.mutate(payload);
  };

  if (isLoadingPO) {
    return <Spin tip="Loading purchase order details..." />;
  }

  if (poError) {
    return <Alert message="Error" description={poError.message} type="error" showIcon />;
  }

  if (!purchaseOrder) {
    return <Alert message="Error" description="Purchase Order not found." type="error" showIcon />;
  }

  const isLoading = createGRNMutation.isPending;

  const columns = [
    { title: 'Product Code', dataIndex: ['product', 'product_code'], key: 'product_code' },
    { title: 'Product Name', dataIndex: ['product', 'name'], key: 'product_name' },
    { title: 'Ordered', dataIndex: 'quantity_ordered', key: 'quantity_ordered' },
    {
      title: 'Received',
      dataIndex: 'quantity_received',
      key: 'quantity_received',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'quantity_received']}
          rules={[{ required: true, message: 'Required' }, { type: 'number', min: 0, max: record.quantity_ordered, message: `Max ${record.quantity_ordered}` }]}
          initialValue={0}
        >
          <InputNumber min={0} max={record.quantity_ordered} />
        </Form.Item>
      ),
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          name={[index, 'unit_cost']}
          rules={[{ required: true, message: 'Required' }]}
          initialValue={parseFloat(record.unit_cost)}
        >
          <InputNumber min={0} precision={4} />
        </Form.Item>
      ),
    },
    {
      title: 'Batch No.',
      dataIndex: 'batch_number',
      key: 'batch_number',
      render: (text: any, record: any, index: number) => (
        <Form.Item name={[index, 'batch_number']}>
          <Input />
        </Form.Item>
      ),
    },
    {
      title: 'Serial No.',
      dataIndex: 'serial_number',
      key: 'serial_number',
      render: (text: any, record: any, index: number) => (
        <Form.Item name={[index, 'serial_number']}>
          <Input />
        </Form.Item>
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (text: any, record: any, index: number) => (
        <Form.Item name={[index, 'expiry_date']}>
          <DatePicker />
        </Form.Item>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title={`Receive Goods for PO: ${purchaseOrder.po_number}`} />

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} disabled={isLoading}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="grn_number" label="GRN Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="received_date" label="Received Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>

          <h3>Purchase Order Lines</h3>
          <Form.List name="lines">
            {(fields) => (
              <Table
                dataSource={fields.map((field, index) => ({ ...field, ...form.getFieldValue(['lines', index]) }))}
                columns={columns}
                pagination={false}
                rowKey="po_line_id"
              />
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Create Goods Receipt
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate(`/po/${poId}`)} disabled={isLoading}>
              Cancel
            </Button>
          </Form.Item>
          {createGRNMutation.error && (
            <Form.Item>
              <Alert message="Error" description={createGRNMutation.error.message} type="error" showIcon />
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
}
