import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'antd';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProductForm } from '../../components/forms/ProductForm';

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const handleSuccess = () => {
    navigate('/products');
  };

  return (
    <div className="p-4">
      <PageHeader title={isEditMode ? 'Edit Product' : 'Create Product'} />
      <Card>
        <ProductForm id={id} onSuccess={handleSuccess} onCancel={() => navigate('/products')} />
      </Card>
    </div>
  );
}
