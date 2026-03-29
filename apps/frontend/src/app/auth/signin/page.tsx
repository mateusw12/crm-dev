'use client';

import { signIn } from 'next-auth/react';
import { Button, Card, Divider, Space, Typography } from 'antd';
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

const { Title, Text } = Typography;

export default function SignInPage() {
  const t = useTranslations('auth');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📊</div>
            <Title level={2} style={{ marginBottom: 4 }}>
              CRM
            </Title>
            <Text type="secondary">{t('signInDescription')}</Text>
          </div>

          <Divider>{t('signIn')}</Divider>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button
              size="large"
              icon={<GithubOutlined />}
              block
              style={{ height: 48, borderRadius: 8 }}
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            >
              {t('signInWith', { provider: 'GitHub' })}
            </Button>

            <Button
              size="large"
              icon={<GoogleOutlined />}
              block
              style={{ height: 48, borderRadius: 8 }}
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              danger
            >
              {t('signInWith', { provider: 'Google' })}
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
}
