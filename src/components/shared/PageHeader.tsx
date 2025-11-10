import { Typography, Space } from 'antd';
import type { ReactNode } from 'react';

const { Title } = Typography;

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Title level={2} style={{ margin: 0 }}>
        {title}
      </Title>
      <Space>{children}</Space>
    </div>
  );
}
