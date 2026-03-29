'use client';

import {
  Avatar,
  Button,
  Card,
  Descriptions,
  List,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { NotificationResponse } from '@/lib/dto';
import { formatDistanceToNow } from 'date-fns';
import { NotificationsService } from '@/lib/services/index';
import { showSuccess } from '@/components/shared/notification/notificationService';

const { Title, Text } = Typography;

export default function NotificationsPage() {
  const tCommon = useTranslations('common');

  const { data: notifications = [], isLoading, mutate } = useSWR<NotificationResponse[]>(
    'notifications-page',
    NotificationsService.getAll,
  );

  const handleMarkRead = async (id: string) => {
    await NotificationsService.markRead(id);
    mutate();
  };

  const handleMarkAllRead = async () => {
    await NotificationsService.markAllRead();
    showSuccess();
    mutate();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Notifications</Title>
        <Button icon={<CheckOutlined />} onClick={handleMarkAllRead}>
          Mark all read
        </Button>
      </div>
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <List
          dataSource={notifications}
          renderItem={(notif: NotificationResponse) => (
            <List.Item
              style={{
                background: notif.read ? 'transparent' : '#f0f4ff',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 4,
              }}
              actions={[
                !notif.read && (
                  <Button
                    key="read"
                    type="text"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={() => handleMarkRead(notif.id)}
                  >
                    Mark read
                  </Button>
                ),
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<BellOutlined />}
                    style={{ background: notif.read ? '#e2e8f0' : '#6366f1' }}
                  />
                }
                title={
                  <span>
                    {notif.title}
                    {!notif.read && (
                      <Tag color="blue" style={{ marginLeft: 8 }}>New</Tag>
                    )}
                  </span>
                }
                description={
                  <span>
                    {notif.message && <Text type="secondary">{notif.message} · </Text>}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </Text>
                  </span>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: tCommon('noData') }}
        />
      </Card>
    </div>
  );
}
