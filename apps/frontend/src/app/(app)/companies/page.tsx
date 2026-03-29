'use client';

import { useState } from 'react';
import {
  Button,
  Table,
  Space,
  Input,
  Popconfirm,
  Typography,
  App,
} from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { CompanyResponse } from '@/lib/dto';
import { CompanyModal } from '@/components/companies/CompanyModal';
import { CompaniesService } from '@/lib/services/index';

const { Title } = Typography;

export default function CompaniesPage() {
  const t = useTranslations('companies');
  const tCommon = useTranslations('common');
  const { message } = App.useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyResponse | null>(null);

  const { data: companies = [], isLoading, mutate } = useSWR(
    ['companies', search],
    () => CompaniesService.getAll({ search }),
  );

  const handleDelete = async (id: string) => {
    try {
      await CompaniesService.delete(id);
      message.success(tCommon('success'));
      mutate();
    } catch {
      message.error(tCommon('error'));
    }
  };

  const columns = [
    { title: tCommon('name'), dataIndex: 'name', key: 'name' },
    { title: t('industry'), dataIndex: 'industry', key: 'industry' },
    { title: t('website'), dataIndex: 'website', key: 'website', render: (v: string) => v ? <a href={v} target="_blank" rel="noreferrer">{v}</a> : null },
    { title: tCommon('phone'), dataIndex: 'phone', key: 'phone' },
    {
      title: tCommon('actions'),
      key: 'actions',
      render: (_: unknown, record: CompanyResponse) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => { setEditingCompany(record); setModalOpen(true); }} />
          <Popconfirm title={t('deleteConfirm')} onConfirm={() => handleDelete(record.id)} okText={tCommon('yes')} cancelText={tCommon('no')}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>{t('title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCompany(null); setModalOpen(true); }}>{t('new')}</Button>
      </div>
      <Input.Search prefix={<SearchOutlined />} allowClear style={{ marginBottom: 16, maxWidth: 400 }} onSearch={setSearch} onChange={(e) => !e.target.value && setSearch('')} />
      <Table dataSource={companies} columns={columns} rowKey="id" loading={isLoading} style={{ background: '#fff', borderRadius: 12 }} />
      <CompanyModal open={modalOpen} company={editingCompany} onClose={() => setModalOpen(false)} onSuccess={() => { setModalOpen(false); mutate(); }} />
    </div>
  );
}
