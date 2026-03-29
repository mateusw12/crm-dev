'use client';

import { useState } from 'react';
import { Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { CompanyResponse } from '@/lib/dto';
import { CompanyModal } from '@/components/companies/CompanyModal';
import { CompaniesService } from '@/lib/services/index';
import { FormGrid } from '@/components/shared/FormGrid';
import { showSuccess } from '@/components/shared/notification/notificationService';
import { handleApiError } from '@/lib/api';

export default function CompaniesPage() {
  const t = useTranslations('companies');
  const tCommon = useTranslations('common');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyResponse | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, mutate } = useSWR(
    ['companies', page],
    () => CompaniesService.getAll({ page, limit: 20 }),
    { keepPreviousData: true },
  );

  const handleRemove = async (record: CompanyResponse) => {
    try {
      await CompaniesService.delete(record.id);
      showSuccess();
      mutate();
    } catch (error) {
      handleApiError(error);
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
        dataSource={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        addButtonLabel={t('new')}
        searchPlaceholder={tCommon('search')}
        pagination={{
          total: data?.total,
          current: page,
          pageSize: 20,
          onChange: setPage,
          showTotal: (total) => `${tCommon('total')}: ${total}`,
        }}
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

