'use client';

import { useState } from 'react';
import {
  Button,
  Space,
  Popconfirm,
  Typography,
  App,
  Avatar,
  Tag,
  Collapse,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { GroupResponse } from '@/lib/dto';
import { GroupModal } from '@/components/groups/GroupModal';
import { GroupsService } from '@/lib/services/groups.service';

const { Title } = Typography;

export default function GroupsPage() {
  const t = useTranslations('groups');
  const tCommon = useTranslations('common');
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponse | null>(null);

  const { data: groups = [], isLoading, mutate } = useSWR<GroupResponse[]>('groups', GroupsService.getAll);

  const handleDelete = async (id: string) => {
    try {
      await GroupsService.delete(id);
      message.success(tCommon('success'));
      mutate();
    } catch {
      message.error(tCommon('error'));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>{t('title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingGroup(null); setModalOpen(true); }}>{t('new')}</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(groups ?? []).map((group) => (
          <Collapse
            key={group.id}
            style={{ borderRadius: 12, background: '#fff' }}
            items={[
              {
                key: group.id,
                label: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <Typography.Text strong>{group.name}</Typography.Text>
                      <Tag color="blue">{(group.group_members ?? []).length} {t('members')}</Tag>
                    </Space>
                    <Space onClick={(e) => e.stopPropagation()}>
                      <Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditingGroup(group); setModalOpen(true); }} />
                      <Popconfirm title="Delete group?" onConfirm={() => handleDelete(group.id)} okText={tCommon('yes')} cancelText={tCommon('no')}>
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  </div>
                ),
                children: (
                  <div>
                      {(group.group_members ?? []).length === 0 ? (
                      <Typography.Text type="secondary">{tCommon('noData')}</Typography.Text>
                    ) : (
                      <Space wrap>
                        {(group.group_members ?? []).map((member) => (
                          <Tag key={member.user_id} style={{ padding: '4px 8px', borderRadius: 20 }}>
                            <Avatar size="small" style={{ marginRight: 4 }}>
                              {member.users?.name?.[0] ?? 'U'}
                            </Avatar>
                            {member.users?.name ?? member.user_id}
                          </Tag>
                        ))}
                      </Space>
                    )}
                  </div>
                ),
              },
            ]}
          />
        ))}
      </div>

      <GroupModal open={modalOpen} group={editingGroup} onClose={() => setModalOpen(false)} onSuccess={() => { setModalOpen(false); mutate(); }} />
    </div>
  );
}
