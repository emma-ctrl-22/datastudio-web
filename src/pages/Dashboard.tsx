import { Alert, Col, Row, Spin, Card, Statistic } from 'antd';
import { useEnhancedDashboardSummaryQuery } from '../api/ReportService';
import { PageHeader } from '../components/shared/PageHeader';
import { KeyMetrics } from '../components/dashboard/KeyMetrics';
import { LowStockProducts } from '../components/dashboard/LowStockProducts';
import { OrderStatusPieChart } from '../components/dashboard/OrderStatusPieChart';
import { StockMovementsBarChart } from '../components/dashboard/StockMovementsBarChart';
import { TopSuppliersList } from '../components/dashboard/TopSuppliersList';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { WarningOutlined, ShoppingCartOutlined, RocketOutlined } from '@ant-design/icons';

export default function Dashboard() {
  const { data, isLoading, error } = useEnhancedDashboardSummaryQuery();

  if (isLoading) {
    return <Spin tip="Loading dashboard..." />;
  }

  if (error) {
    return <Alert message="Error" description={error.message} type="error" showIcon />;
  }

  if (!data) {
    return <Alert message="No data available" type="info" showIcon />;
  }

  const pendingPOs = data.purchase_order_status_summary
    .filter(s => ['sent', 'part_received'].includes(s.status))
    .reduce((acc, s) => acc + s.count, 0);

  const openDispatches = data.dispatch_order_status_summary
    .filter(s => ['draft', 'confirmed'].includes(s.status))
    .reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="p-4">
      <PageHeader title="Dashboard" />
      <Row gutter={[16, 16]}>
        {/* Key Metrics */}
        <Col xs={24} lg={24}>
          <KeyMetrics stock_valuation={data.stock_valuation} />
        </Col>

        {/* Summary Cards */}
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Low Stock Items"
              value={data.low_stock_products.length}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Pending Purchase Orders"
              value={pendingPOs}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Open Dispatch Orders"
              value={openDispatches}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>

        {/* Low Stock Products */}
        <Col xs={24} md={12} lg={8}>
          <LowStockProducts data={data.low_stock_products} loading={isLoading} />
        </Col>

        {/* Stock Movements */}
        <Col xs={24} md={12} lg={16}>
          <StockMovementsBarChart data={data.stock_movement_summary} loading={isLoading} />
        </Col>

        {/* PO Status */}
        <Col xs={24} md={12} lg={8}>
          <OrderStatusPieChart title="Purchase Order Status" data={data.purchase_order_status_summary} loading={isLoading} />
        </Col>

        {/* Dispatch Status */}
        <Col xs={24} md={12} lg={8}>
          <OrderStatusPieChart title="Dispatch Order Status" data={data.dispatch_order_status_summary} loading={isLoading} />
        </Col>
        
        {/* Top Suppliers */}
        <Col xs={24} md={12} lg={8}>
          <TopSuppliersList data={data.top_suppliers} loading={isLoading} />
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={24}>
          <RecentActivityFeed data={data.recently_received_items} loading={isLoading} />
        </Col>
      </Row>
    </div>
  );
}

