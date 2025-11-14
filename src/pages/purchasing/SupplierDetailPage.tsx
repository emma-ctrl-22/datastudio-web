import { useParams, Link } from 'react-router-dom';
import { Card, Descriptions, Spin, Alert, Table, Tag } from 'antd';
import { PageHeader } from '../../components/shared/PageHeader';
import { useGetSupplierQuery, useGetProductsBySupplierQuery } from '../../api/SupplierService';
import type { ProductSupplier } from '../../types';

export function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: supplier,
    isLoading: isLoadingSupplier,
    error: supplierError,
  } = useGetSupplierQuery(id!, { enabled: !!id });

  const {
    data: productSuppliers,
    isLoading: isLoadingProductSuppliers,
    error: productSuppliersError,
  } = useGetProductsBySupplierQuery(id!, { enabled: !!id });

  if (isLoadingSupplier || isLoadingProductSuppliers) {
    return <Spin tip="Loading supplier details..." />;
  }

  if (supplierError) {
    return <Alert message="Error" description={supplierError.message} type="error" showIcon />;
  }

  if (productSuppliersError) {
    return <Alert message="Error" description={productSuppliersError.message} type="error" showIcon />;
  }

  const productColumns = [
    {
      title: 'Product Code',
      dataIndex: ['product', 'product_code'],
      key: 'product_code',
      render: (text: string, record: ProductSupplier) => (
        <Link to={`/products/${record.product.id}/edit`}>{text}</Link>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: ['product', 'name'],
      key: 'product_name',
    },
    {
      title: 'Category',
      dataIndex: ['product', 'category', 'name'],
      key: 'category_name',
      render: (text: string) => text || <Tag>N/A</Tag>,
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
      title: 'Primary Supplier',
      dataIndex: 'is_primary_supplier',
      key: 'is_primary_supplier',
      render: (isPrimary: boolean) => (isPrimary ? 'Yes' : 'No'),
    },
  ];

  return (
    <div className="p-4 md:p-0">
      <PageHeader title={`Supplier: ${supplier?.name}`} />

      <Card title="Supplier Details" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="Supplier Code">{supplier?.supplier_code}</Descriptions.Item>
          <Descriptions.Item label="Name">{supplier?.name}</Descriptions.Item>
          <Descriptions.Item label="Contact Person">{supplier?.contact_person || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email">{supplier?.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{supplier?.phone || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Address">{supplier?.address || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Active">
            <Tag color={supplier?.is_active ? 'green' : 'red'}>{supplier?.is_active ? 'Yes' : 'No'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(supplier?.created_at || '').toLocaleString()}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Products Supplied">
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={productColumns}
            dataSource={productSuppliers || []}
            loading={isLoadingProductSuppliers}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </Card>
    </div>
  );
}
