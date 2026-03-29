'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Typography, Space, Button } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  BankOutlined,
  FundOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  GroupOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { NotificationsService } from '@/lib/services/index';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const SIDER_BG = '#0f172a';
const SIDER_ITEM_COLOR = '#94a3b8';
const SIDER_ACTIVE_COLOR = '#6366f1';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');

  // Force sign-out when the backend JWT has expired
  useEffect(() => {
    if ((session as any)?.error === 'TokenExpired') {
      signOut({ callbackUrl: '/auth/signin' });
    }
  }, [session]);

  const { data: notifications } = useSWR('notifications', NotificationsService.getAll, {
    refreshInterval: 30000,
  });

  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: t('dashboard') },
    { key: '/contacts', icon: <TeamOutlined />, label: t('contacts') },
    { key: '/companies', icon: <BankOutlined />, label: t('companies') },
    { key: '/deals', icon: <FundOutlined />, label: t('deals') },
    { key: '/tasks', icon: <CheckSquareOutlined />, label: t('tasks') },
    { key: '/calendar', icon: <CalendarOutlined />, label: t('calendar') },
    { key: '/groups', icon: <GroupOutlined />, label: t('groups') },
  ];

  const changeLocale = async (locale: string) => {
    await fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale }),
    });
    window.location.reload();
  };

  const userMenuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('settings'),
      onClick: () => router.push('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: tAuth('signOut'),
      onClick: () => signOut({ callbackUrl: '/auth/signin' }),
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        style={{ background: SIDER_BG, position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100 }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            paddingInline: collapsed ? 0 : 20,
            borderBottom: '1px solid #1e293b',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 24 }}>📊</span>
          {!collapsed && (
            <Text style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>CRM</Text>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          style={{ background: 'transparent', border: 'none', marginTop: 8 }}
          items={menuItems.map((item) => ({
            ...item,
            style: {
              color: pathname === item.key ? SIDER_ACTIVE_COLOR : SIDER_ITEM_COLOR,
              borderRadius: 8,
              marginInline: 8,
            },
            onClick: () => router.push(item.key),
          }))}
          theme="dark"
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            background: '#fff',
            paddingInline: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Space>
            <Dropdown
              menu={{
                items: [
                  { key: 'en', label: 'English', onClick: () => changeLocale('en') },
                  { key: 'pt', label: 'Português', onClick: () => changeLocale('pt') },
                ],
              }}
            >
              <Button type="text" icon={<GlobalOutlined />} />
            </Dropdown>

            <Badge count={unreadCount} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => router.push('/notifications')}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar src={session?.user?.image} style={{ background: SIDER_ACTIVE_COLOR }}>
                  {session?.user?.name?.[0] ?? 'U'}
                </Avatar>
                <Text style={{ display: 'none' }}>{session?.user?.name}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
