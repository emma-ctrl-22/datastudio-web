import { useEffect, useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Switch, Spin, Alert, Tabs, Table, Modal, Popconfirm,Row, Col} from 'antd';
import { useForm } from 'antd/es/form/Form';
import {
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useListProductImagesQuery,
  useAddProductImageMutation,
  useDeleteProductImageMutation,
} from '../../api/ProductService';
import { useListCategoriesQuery } from '../../api/ProductService';
import { useListSuppliersQuery } from '../../api/SupplierService';
import {
  useListProductSuppliersQuery,
  useLinkProductSupplierMutation,
  useUpdateProductSupplierMutation,
  useDeleteProductSupplierMutation,
} from '../../api/ProductSupplierService';
import type {
  CreateProductPayload,
  UpdateProductPayload,
  ProductSupplier,
  ProductImage,
  LinkProductSupplierPayload,
  // UpdateProductSupplierPayload,
  AddProductImagePayload,
} from '../../types';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

type ProductFormProps = {
  id?: string; // If id is provided, it's an edit form
  onSuccess: () => void;
  onCancel: () => void;
};

export function ProductForm({ id, onSuccess, onCancel }: ProductFormProps) {
  const [form] = useForm();
  const [supplierForm] = useForm();
  const [imageForm] = useForm();
  const isEditMode = !!id;

  const [activeTab, setActiveTab] = useState('general');
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [editingProductSupplier, setEditingProductSupplier] = useState<ProductSupplier | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  // Data fetching
  const { data: product, isLoading: isLoadingProduct, error: productError } = useGetProductQuery(id!, {
    enabled: isEditMode,
  });
  const { data: categories, isLoading: isLoadingCategories } = useListCategoriesQuery(true);
  const { data: suppliers, isLoading: isLoadingSuppliers } = useListSuppliersQuery(true);
  const {
    data: productSuppliers,
    isLoading: isLoadingProductSuppliers,
    error: productSuppliersError,
    refetch: refetchProductSuppliers,
  } = useListProductSuppliersQuery(id!, { enabled: isEditMode });
  const {
    data: productImages,
    isLoading: isLoadingProductImages,
    error: productImagesError,
    refetch: refetchProductImages,
  } = useListProductImagesQuery(id!, { enabled: isEditMode });

  // Mutations
  const createProductMutation = useCreateProductMutation({
    onSuccess: () => {
      onSuccess();
    },
  });
  const updateProductMutation = useUpdateProductMutation({
    onSuccess: () => {
      onSuccess();
    },
  });
  const linkProductSupplierMutation = useLinkProductSupplierMutation(id!, {
    onSuccess: () => {
      refetchProductSuppliers();
      setIsSupplierModalVisible(false);
      supplierForm.resetFields();
    },
  });
  const updateProductSupplierMutation = useUpdateProductSupplierMutation({
    onSuccess: () => {
      refetchProductSuppliers();
      setIsSupplierModalVisible(false);
      supplierForm.resetFields();
      setEditingProductSupplier(null);
    },
  });
  const deleteProductSupplierMutation = useDeleteProductSupplierMutation({
    onSuccess: () => {
      refetchProductSuppliers();
    },
  });
  const addProductImageMutation = useAddProductImageMutation(id!, {
    onSuccess: () => {
      refetchProductImages();
      setIsImageModalVisible(false);
      imageForm.resetFields();
    },
  });
  const deleteProductImageMutation = useDeleteProductImageMutation({
    onSuccess: () => {
      refetchProductImages();
    },
  });

  // Set form values when in edit mode and data is loaded
  useEffect(() => {
    if (isEditMode && product) {
      form.setFieldsValue({
        ...product,
        category_id: product.category?.id,
      });
    }
  }, [product, isEditMode, form]);

  useEffect(() => {
    if (editingProductSupplier) {
      supplierForm.setFieldsValue({
        supplier_id: editingProductSupplier.supplier.id,
        supplier_part_number: editingProductSupplier.supplier_part_number,
        is_primary_supplier: editingProductSupplier.is_primary_supplier,
        unit_cost: editingProductSupplier.unit_cost,
      });
    } else {
      supplierForm.resetFields();
    }
  }, [editingProductSupplier, supplierForm]);

  const onFinishGeneral = (values: CreateProductPayload | UpdateProductPayload) => {
    if (isEditMode) {
      updateProductMutation.mutate({ id: id!, payload: values });
    } else {
      createProductMutation.mutate(values as CreateProductPayload);
    }
  };

  const handleAddEditSupplier = (values: LinkProductSupplierPayload) => {
    if (editingProductSupplier) {
      updateProductSupplierMutation.mutate({ id: editingProductSupplier.id, payload: values });
    } else {
      linkProductSupplierMutation.mutate(values);
    }
  };

  const handleAddImage = (values: AddProductImagePayload) => {
    addProductImageMutation.mutate(values);
  };

  const isLoading =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    linkProductSupplierMutation.isPending ||
    updateProductSupplierMutation.isPending ||
    deleteProductSupplierMutation.isPending ||
    addProductImageMutation.isPending ||
    deleteProductImageMutation.isPending;

  if (isLoadingProduct) {
    return <Spin tip="Loading product..." />;
  }

  if (productError) {
    return <Alert message="Error" description={productError.message} type="error" showIcon />;
  }

  const supplierColumns = [
    {
      title: 'Supplier Name',
      dataIndex: ['supplier', 'name'],
      key: 'supplier_name',
    },
    {
      title: 'Supplier Part No.',
      dataIndex: 'supplier_part_number',
      key: 'supplier_part_number',
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
    },
    {
      title: 'Primary',
      dataIndex: 'is_primary_supplier',
      key: 'is_primary_supplier',
      render: (isPrimary: boolean) => (isPrimary ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ProductSupplier) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProductSupplier(record);
              setIsSupplierModalVisible(true);
            }}
          />
          <Popconfirm
            title="Delete the supplier link"
            description="Are you sure you want to delete this supplier link?"
            onConfirm={() => deleteProductSupplierMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const imageColumns = [
    {
      title: 'Image',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => <img src={url} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} />,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url_text',
      ellipsis: true,
    },
    {
      title: 'Alt Text',
      dataIndex: 'alt_text',
      key: 'alt_text',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ProductImage) => (
        <div className="flex justify-center">
          <Popconfirm
            title="Delete the image"
            description="Are you sure you want to delete this image?"
            onConfirm={() => deleteProductImageMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinishGeneral} disabled={isLoading}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="General" key="general">
            {isEditMode && (
              <Form.Item name="product_code" label="Product Code">
                <Input disabled />
              </Form.Item>
            )}
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="category_id" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
                  <Select loading={isLoadingCategories} placeholder="Select a category">
                    {categories?.map((cat) => (
                      <Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="unit_of_measure" label="Unit of Measure" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="barcode" label="Barcode">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="serial_number" label="Serial Number">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="reorder_level" label="Reorder Level" initialValue={0}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="is_active" label="Active" valuePropName="checked" initialValue={true}>
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            {!isEditMode && (
              <>
                <h3>Primary Supplier (Optional)</h3>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="initial_supplier_id" label="Supplier">
                      <Select loading={isLoadingSuppliers} placeholder="Select a supplier" allowClear>
                        {suppliers?.map((sup) => (
                          <Option key={sup.id} value={sup.id}>
                            {sup.name} ({sup.supplier_code})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="initial_supplier_part_number" label="Supplier Part Number">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="initial_unit_cost" label="Unit Cost">
                      <InputNumber min={0} precision={4} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Form.Item>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="primary" htmlType="submit" loading={isLoading} block>
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </Button>
                <Button onClick={onCancel} disabled={isLoading} block>
                  Cancel
                </Button>
              </div>
            </Form.Item>
            {(createProductMutation.error || updateProductMutation.error) && (
              <Form.Item>
                <Alert
                  message="Error"
                  description={createProductMutation.error?.message || updateProductMutation.error?.message}
                  type="error"
                  showIcon
                />
              </Form.Item>
            )}
          </TabPane>

          {isEditMode && (
            <TabPane tab="Suppliers" key="suppliers">
              <Button
                type="primary"
                onClick={() => {
                  setEditingProductSupplier(null);
                  setIsSupplierModalVisible(true);
                }}
                icon={<PlusOutlined />}
                style={{ marginBottom: 16 }}
              >
                Link Supplier
              </Button>
              {productSuppliersError && (
                <Alert message="Error" description={productSuppliersError.message} type="error" showIcon />
              )}
              <div className="overflow-x-auto">
                <Table
                  columns={supplierColumns}
                  dataSource={productSuppliers || []}
                  loading={isLoadingProductSuppliers}
                  rowKey="id"
                  pagination={false}
                />
              </div>
            </TabPane>
          )}

          {isEditMode && (
            <TabPane tab="Images" key="images">
              <Button
                type="primary"
                onClick={() => setIsImageModalVisible(true)}
                icon={<PlusOutlined />}
                style={{ marginBottom: 16 }}
              >
                Add Image
              </Button>
              {productImagesError && (
                <Alert message="Error" description={productImagesError.message} type="error" showIcon />
              )}
              <div className="overflow-x-auto">
                <Table
                  columns={imageColumns}
                  dataSource={productImages || []}
                  loading={isLoadingProductImages}
                  rowKey="id"
                  pagination={false}
                />
              </div>
            </TabPane>
          )}
        </Tabs>
      </Form>

      {/* Supplier Modal */}
      <Modal
        title={editingProductSupplier ? 'Edit Supplier Link' : 'Link New Supplier'}
        open={isSupplierModalVisible}
        onCancel={() => {
          setIsSupplierModalVisible(false);
          setEditingProductSupplier(null);
          supplierForm.resetFields();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsSupplierModalVisible(false);
              setEditingProductSupplier(null);
              supplierForm.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={linkProductSupplierMutation.isPending || updateProductSupplierMutation.isPending}
            onClick={() => supplierForm.submit()}
          >
            {editingProductSupplier ? 'Update Link' : 'Link Supplier'}
          </Button>,
        ]}
      >
        <Form form={supplierForm} layout="vertical" onFinish={handleAddEditSupplier}>
          <Form.Item name="supplier_id" label="Supplier" rules={[{ required: true, message: 'Please select a supplier!' }]}>
            <Select loading={isLoadingSuppliers} placeholder="Select a supplier" disabled={!!editingProductSupplier}>
              {suppliers?.map((sup) => (
                <Option key={sup.id} value={sup.id}>
                  {sup.name} ({sup.supplier_code})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="supplier_part_number" label="Supplier Part Number">
            <Input />
          </Form.Item>
          <Form.Item name="unit_cost" label="Unit Cost">
            <InputNumber min={0} precision={4} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_primary_supplier" label="Primary Supplier" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Image Modal */}
      <Modal
        title="Add Product Image"
        open={isImageModalVisible}
        onCancel={() => {
          setIsImageModalVisible(false);
          imageForm.resetFields();
        }}
        footer={[
          <Button key="back" onClick={() => {
            setIsImageModalVisible(false);
            imageForm.resetFields();
          }}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={addProductImageMutation.isPending}
            onClick={() => imageForm.submit()}
          >
            Add Image
          </Button>,
        ]}
      >
        <Form form={imageForm} layout="vertical" onFinish={handleAddImage}>
          <Form.Item name="url" label="Image URL" rules={[{ required: true, message: 'Please enter image URL!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="alt_text" label="Alt Text">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
