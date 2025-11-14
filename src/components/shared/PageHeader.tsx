import { Typography, Space } from 'antd';
import type { ReactNode } from 'react';

const { Title } = Typography;

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <Title level={2} style={{ margin: 0 }}>
        {title}
      </Title>
      <div className="mt-4 sm:mt-0">
        <Space direction="vertical" size="small" className="sm:flex sm:flex-row sm:space-x-2">
          {children}
        </Space>
      </div>
    </div>
  );
}
