'use client';

import { useState } from 'react';
import { Tag, Avatar, Space, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { App } from 'antd';
import type { GroupResponse } from '@/lib/dto';
import { GroupModal } from '@/components/groups/GroupModal';
import { GroupsService } from '@/lib/services/groups.service';
import { FormGrid } from '@/components/shared/FormGrid';

export default function GroupsPage() {
  const t = useTranslations('groups');
  const tCommon = useTranslations('common');
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponse | null>(null);

  const { data: groups = [], isLoading, mutate } = useSWR<GroupResponse[]>(
    'groups',
    GroupsService.getAll,
  );

  const handleAdd = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };

  const handleEdit = (record: GroupResponse) => {
    setEditingGroup(record);
    setModalOpen(true);
  };

  const handleRemove = async (record: GroupResponse) => {
    try {
      await GroupsService.delete(record.id);
      message.success(tCommon('success'));
      mutate();
    } catch {
      message.error(tCommon('error'));
    }
  };

  const columns: TableColumnsType<GroupResponse> = [
    {
      title: tCommon('name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: tCommon('description'),
      dataIndex: 'description',
      key: 'description',
      render: (v?: string) => v ?? '—',
    },
    {
      title: t('members'),
      key: 'members',
      render: (_: unknown, record: GroupResponse) => {
        const members = record.group_members ?? [];
        if (!members.length) return <Typography.Text type="secondary">—</Typography.Text>;
        return (
          <Space size={4} wrap>
            {members.map((m) => (
              <Tag key={m.user_id} style={{ borderRadius: 20, padding: '2px 8px' }}>
                <Avatar size="small" style={{ marginRight: 4 }}>
                  {m.users?.name?.[0] ?? 'U'}
                </Avatar>
                {m.users?.name ?? m.user_id}
              </Tag>
            ))}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <FormGrid<GroupResponse>
        dataSource={groups}
        columns={columns}
        loading={isLoading}
        addButtonLabel={t('new')}
        searchPlaceholder={tCommon('search')}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />

      <GroupModal
        open={modalOpen}
        group={editingGroup}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); mutate(); }}
      />
    </>
  );
}

