import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Divider } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useLoginMutation } from '../api/UserService';
import { useAuthStore } from '../store/auth';
import { sanitizeString } from '../utils/sanitize';

export default function Login() {
  const setAuth = useAuthStore(s => s.setAuth);
  const [usernameOrEmail, setU] = useState('');
  const [password, setP] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const mut = useLoginMutation({
    onSuccess: (data) => {
      setAuth({ user: data.user, roles: data.roles, permissions: data.permissions });
      navigate('/', { replace: true }); // Use navigate for client-side routing
    },
    onError: (e: Error) => setError(e.message || 'Login failed')
  });

  const onFinish = () => {
    mut.mutate({
      usernameOrEmail: sanitizeString(usernameOrEmail),
      password: sanitizeString(password)
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Typography.Title style={{ margin: 0 }}>DataStudio</Typography.Title>
          <Typography.Text type="secondary">Inventory Management System</Typography.Text>
        </div>
        <Card className="shadow-md">
          <div className="mb-4 text-center">
            <Typography.Title level={3} style={{ margin: 0 }}>Welcome back</Typography.Title>
            <Typography.Text type="secondary">Sign in to continue</Typography.Text>
          </div>
          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} showIcon />
            </div>
          )}
          <Form layout="vertical" onFinish={onFinish} autoComplete="off" disabled={mut.isPending}>
            <Form.Item label="Username or Email" required rules={[{ required: true, message: 'Please enter your username or email' }] }>
              <Input
                value={usernameOrEmail}
                onChange={(e) => setU(e.target.value)}
                placeholder="you@example.com"
                size="large"
              />
            </Form.Item>
            <Form.Item label="Password" required rules={[{ required: true, message: 'Please enter your password' }] }>
              <Input.Password
                value={password}
                onChange={(e) => setP(e.target.value)}
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={mut.isPending}>
              Sign in
            </Button>
          </Form>
          <Divider plain>Need access?</Divider>
          <div className="text-center text-sm text-gray-500">Contact your administrator to create an account.</div>
        </Card>
        <div className="mt-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} DataStudio</div>
      </div>
    </div>
  );
}


