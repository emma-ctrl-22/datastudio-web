import { Layout, Menu, Typography, Avatar, Popover, Button, Card } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import { useAuthStore } from '../store/auth';
import { hasPermission } from '../utils/permissions';
import { useGetUserQuery } from '../api/UserService';
import logo from '../assets/logo.png';
import {
  DatabaseOutlined,
  AppstoreOutlined,
  BoxPlotOutlined,
  TagsOutlined,
  SwapOutlined,
  CheckSquareOutlined,
  WarningOutlined,
  ShopOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  RocketOutlined,
  SendOutlined,
  BarChartOutlined,
  DashboardOutlined,
  HistoryOutlined,
  RiseOutlined,
  FallOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

type MenuItem = {
  key: string;
  label: string;
  path?: string;
  children?: MenuItem[];
  required?: { resource: string; action: string };
  icon?: React.ReactNode;
};

function UserProfile() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const clearAuth = useAuthStore(s => s.clear);
  const { data: userData } = useGetUserQuery(user?.id ?? '', { queryKey: ['user', user?.id], enabled: !!user?.id });

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const profileContent = (
    <Card size="small" bordered={false}>
      <div className="text-center">
        <Avatar size={64} icon={<UserOutlined />} src={userData?.user.email} />
        <Typography.Title level={5} className="mt-2 mb-0">{userData?.user.username}</Typography.Title>
        <Typography.Text type="secondary">{userData?.user.email}</Typography.Text>
      </div>
      <Button type="primary" danger block icon={<LogoutOutlined />} onClick={handleLogout} className="mt-4">
        Logout
      </Button>
    </Card>
  );

  return (
    <Popover content={profileContent} trigger="click" placement="bottomRight">
      <Button type="text" shape="circle">
        <Avatar size="large" icon={<UserOutlined />} src={userData?.user.email} />
      </Button>
    </Popover>
  );
}


function useMenuItems() {
  const perms = useAuthStore(s => s.permissions);
  const can = useCallback((resource: string, action: string) => hasPermission(perms, resource, action), [perms]);

  const allItems: MenuItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/',
      required: { resource: 'reports', action: 'read' },
      icon: <DashboardOutlined />
    },
    {
      key: 'a',
      label: 'Items & Categories',
      icon: <AppstoreOutlined />,
      children: [
        { key: 'products', label: 'Products', path: '/products', required: { resource: 'products', action: 'read' }, icon: <BoxPlotOutlined /> },
        { key: 'categories', label: 'Categories', path: '/categories', required: { resource: 'products', action: 'read' }, icon: <TagsOutlined /> }
      ]
    },
    {
      key: 'b',
      label: 'Stock',
      icon: <DatabaseOutlined />,
      children: [
        { key: 'movements', label: 'Movements', path: '/stock/movements', required: { resource: 'products', action: 'read' }, icon: <SwapOutlined /> },
        { key: 'balances', label: 'Current Stock', path: '/stock/balances', required: { resource: 'products', action: 'read' }, icon: <CheckSquareOutlined /> },
        { key: 'reorder', label: 'Reorder Alerts', path: '/stock/reorder', required: { resource: 'products', action: 'read' }, icon: <WarningOutlined /> }
      ]
    },
    {
      key: 'c',
      label: 'Suppliers & Purchasing',
      icon: <ShopOutlined />,
      children: [
        { key: 'suppliers', label: 'Suppliers', path: '/suppliers', required: { resource: 'suppliers', action: 'read' }, icon: <TeamOutlined /> },
        { key: 'po', label: 'Purchase Orders', path: '/po', required: { resource: 'purchase_orders', action: 'read' }, icon: <ShoppingCartOutlined /> },
      ]
    },
    {
      key: 'd',
      label: 'Dispatch',
      icon: <RocketOutlined />,
      children: [
        { key: 'dispatch', label: 'Dispatch Orders', path: '/dispatch', required: { resource: 'dispatches', action: 'read' }, icon: <SendOutlined /> }
      ]
    },
    {
      key: 'e',
      label: 'Reports',
      icon: <BarChartOutlined />,
      children: [
        { key: 'purchase-history', label: 'Purchase History', path: '/reports/purchase-history', required: { resource: 'reports', action: 'read' }, icon: <HistoryOutlined /> },
        { key: 'dispatch-history', label: 'Dispatch History', path: '/reports/dispatch-history', required: { resource: 'reports', action: 'read' }, icon: <HistoryOutlined /> },
        { key: 'fast-movers', label: 'Fast Movers', path: '/reports/fast-movers', required: { resource: 'reports', action: 'read' }, icon: <RiseOutlined /> },
        { key: 'slow-movers', label: 'Slow Movers', path: '/reports/slow-movers', required: { resource: 'reports', action: 'read' }, icon: <FallOutlined /> },
      ]
    },
    {
      key: 'f',
      label: 'Admin',
      icon: <SettingOutlined />,
      children: [
        { key: 'users', label: 'User Management', path: '/admin/users', required: { resource: 'users', action: 'read' }, icon: <UserOutlined /> },
        { key: 'roles', label: 'Role Management', path: '/admin/roles', required: { resource: 'roles', action: 'read' }, icon: <TeamOutlined /> }
      ]
    }
  ];

  return useMemo(() => {
    return allItems.map(item => {
      if (item.children) {
        const visibleChildren = item.children.filter(child => !child.required || can(child.required.resource, child.required.action));
        return { ...item, children: visibleChildren };
      }
      return item;
    }).filter(item => {
      if (item.children) {
        return item.children.length > 0;
      }
      if (item.required) {
        return can(item.required.resource, item.required.action);
      }
      return true;
    });
  }, [allItems, can]);
}

export default function DefaultLayout() {
  const items = useMenuItems();
  const location = useLocation();

  const selectedKey = useMemo(() => {
    if (location.pathname === '/') return 'dashboard';
    for (const item of items) {
      if (item.path && item.path !== '/' && location.pathname.startsWith(item.path)) {
        return item.key;
      }
      if (item.children) {
        for (const c of item.children) {
          if (c.path && c.path !== '/' && location.pathname.startsWith(c.path)) return c.key;
        }
      }
    }
    return 'dashboard';
  }, [items, location.pathname]);

  const antdMenu = items.map(item => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        label: item.label,
        icon: item.icon,
        children: item.children.map(child => ({
          key: child.key,
          icon: child.icon,
          label: child.path ? <Link to={child.path}>{child.label}</Link> : child.label
        }))
      };
    }
    return {
      key: item.key,
      icon: item.icon,
      label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label
    };
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" width={250}>
        <div className="flex items-center justify-center p-4">
          <img
            src={logo}
            alt="DataStudio Logo"
            style={{
              maxWidth: '160px',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              background: 'none',
              display: 'block'
            }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={antdMenu}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>Inventory Management</Typography.Title>
          <UserProfile />
        </Header>
        <Content style={{ margin: '24px 16px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 'calc(100vh - 112px)', borderRadius: 8 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}


