'use client';

import { useState } from 'react';
import { Typography, App } from 'antd';
import type { TableColumnsType } from 'antd';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { CompanyResponse } from '@/lib/dto';
import { CompanyModal } from '@/components/companies/CompanyModal';
import { CompaniesService } from '@/lib/services/index';
import { FormGrid } from '@/components/shared/FormGrid';

export default function CompaniesPage() {
  const t = useTranslations('companies');
  const tCommon = useTranslations('common');
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyResponse | null>(null);

  const { data: companies = [], isLoading, mutate } = useSWR(
    'companies',
    () => CompaniesService.getAll({}),
  );

  const handleRemove = async (record: CompanyResponse) => {
    try {
      await CompaniesService.delete(record.id);
      message.success(tCommon('success'));
      mutate();
    } catch {
      message.error(tCommon('error'));
    }
  };

  const columns: TableColumnsType<CompanyResponse> = [
    {
      title: tCommon('name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('industry'),
      dataIndex: 'industry',
      key: 'industry',
      render: (v?: string) => v ?? '—',
    },
    {
      title: t('website'),
      dataIndex: 'website',
      key: 'website',
      render: (v?: string) =>
        v ? <a href={v} target="_blank" rel="noreferrer">{v}</a> : '—',
    },
    {
      title: tCommon('phone'),
      dataIndex: 'phone',
      key: 'phone',
      render: (v?: string) => v ?? '—',
    },
  ];

  return (
    <>
      <FormGrid<CompanyResponse>
        dataSource={companies}
        columns={columns}
        loading={isLoading}
        addButtonLabel={t('new')}
        searchPlaceholder={tCommon('search')}
        onAdd={() => { setEditingCompany(null); setModalOpen(true); }}
        onEdit={(record) => { setEditingCompany(record); setModalOpen(true); }}
        onRemove={handleRemove}
      />

      <CompanyModal
        open={modalOpen}
        company={editingCompany}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); mutate(); }}
      />
    </>
  );
}

