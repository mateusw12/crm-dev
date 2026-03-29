'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, Popconfirm, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import type { DealResponse } from '@/lib/dto';

interface KanbanCardProps {
  deal: DealResponse;
  overlay?: boolean;
  onEdit?: (deal: DealResponse) => void;
  onDelete?: (id: string) => void;
}

export function KanbanCard({ deal, overlay, onEdit, onDelete }: KanbanCardProps) {
  const tCommon = useTranslations('common');
  const t = useTranslations('deals');

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    disabled: overlay,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        opacity: isDragging ? 0.4 : 1,
        cursor: overlay ? 'grabbing' : 'grab',
      }}
      {...listeners}
      {...attributes}
    >
      <Card
        className="kanban-card"
        size="small"
        style={{
          borderRadius: 8,
          boxShadow: overlay
            ? '0 8px 24px rgba(0,0,0,0.15)'
            : '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
        }}
        bodyStyle={{ padding: '10px 12px' }}
      >
        <Typography.Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
          {deal.title}
        </Typography.Text>
        {deal.contacts && (
          <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            👤 {deal.contacts.name}
          </Typography.Text>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Space style={{ color: '#10b981', fontWeight: 600, fontSize: 12 }}>
            <DollarOutlined />
            {deal.value?.toLocaleString() ?? '0'}
          </Space>
          {!overlay && onEdit && onDelete && (
            <Space size={0}>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined style={{ fontSize: 12 }} />}
                onClick={(e) => { e.stopPropagation(); onEdit(deal); }}
              />
              <Popconfirm
                title={t('deleteConfirm')}
                onConfirm={(e) => { e?.stopPropagation(); onDelete(deal.id); }}
                okText={tCommon('yes')}
                cancelText={tCommon('no')}
              >
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            </Space>
          )}
        </div>
      </Card>
    </div>
  );
}
