import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'antd';
import { PageHeader } from '../../components/shared/PageHeader';
import { SupplierForm } from '../../components/forms/SupplierForm';

export function SupplierFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const handleSuccess = () => {
    navigate('/suppliers');
  };

  return (
    <div>
      <PageHeader title={isEditMode ? 'Edit Supplier' : 'Create Supplier'} />
      <Card>
        <SupplierForm id={id} onSuccess={handleSuccess} onCancel={() => navigate('/suppliers')} />
      </Card>
    </div>
  );
}
