import { Card, Col, Row, Statistic } from 'antd';
import { DollarOutlined, DatabaseOutlined } from '@ant-design/icons';
import type { StockValuation } from '../../../types';

interface KeyMetricsProps {
  stock_valuation: StockValuation;
}

export function KeyMetrics({ stock_valuation }: KeyMetricsProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={12} lg={12}>
        <Card>
          <Statistic
            title="Total Inventory Value"
            value={stock_valuation.total_value}
            precision={2}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12}>
        <Card>
          <Statistic
            title="Total Items (SKUs)"
            value={stock_valuation.total_items}
            prefix={<DatabaseOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}
