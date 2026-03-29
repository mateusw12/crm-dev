'use client';

import { useState } from 'react';
import {
  Button,
  Space,
  Tag,
  Typography,
  Avatar,
  Dropdown,
} from 'antd';
import {
  DownloadOutlined,
  UploadOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import type { ContactResponse } from '@/lib/dto';
import { ContactModal } from '@/components/contacts/ContactModal';
import { ImportContactsModal } from '@/components/contacts/ImportContactsModal';
import { ContactsService } from '@/lib/services/index';
import { FormGrid } from '@/components/shared/FormGrid';
import { showSuccess } from '@/components/shared/notification/notificationService';
import { handleApiError } from '@/lib/api';

const { Title } = Typography;

export default function ContactsPage() {
  const t = useTranslations('contacts');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactResponse | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    ['contacts', page],
    () => ContactsService.getAll({ page, limit: 20 }),
    { keepPreviousData: true },
  );

  const handleDelete = async (record: ContactResponse) => {
    try {
      await ContactsService.delete(record.id);
      showSuccess();
      mutate();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await ContactsService.exportCsv();
    } catch (error) {
      handleApiError(error);
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    {
      title: tCommon('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ContactResponse) => (
        <Space>
          <Avatar style={{ background: '#6366f1' }}>{name[0]}</Avatar>
          <Button type="link" onClick={() => router.push(`/contacts/${record.id}`)}>
            {name}
          </Button>
        </Space>
      ),
    },
    { title: tCommon('email'), dataIndex: 'email', key: 'email' },
    { title: tCommon('phone'), dataIndex: 'phone', key: 'phone' },
    {
      title: t('company'),
      key: 'company',
      render: (_: unknown, record: ContactResponse) =>
        record.companies ? (
          <Tag color="blue">{record.companies.name}</Tag>
        ) : null,
    },
  ];

  const extraToolbar = (
    <Space>
      <Button
        icon={<UploadOutlined />}
        onClick={() => setImportOpen(true)}
      >
        {t('importTitle')}
      </Button>
      <Button
        icon={<DownloadOutlined />}
        loading={exporting}
        onClick={handleExport}
      >
        {tCommon('export')} CSV
      </Button>
    </Space>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          {t('title')}
        </Title>
      </div>

      <FormGrid<ContactResponse>
        dataSource={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={{
          total: data?.total,
          current: page,
          pageSize: 20,
          onChange: setPage,
          showTotal: (total) => `${tCommon('total')}: ${total}`,
        }}
        showAddButton
        addButtonLabel={t('new')}
        searchPlaceholder={tCommon('search')}
        onAdd={() => { setEditingContact(null); setModalOpen(true); }}
        onEdit={(record) => { setEditingContact(record); setModalOpen(true); }}
        onRemove={handleDelete}
        extraToolbar={extraToolbar}
      />

      <ContactModal
        open={modalOpen}
        contact={editingContact}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          mutate();
        }}
      />

      <ImportContactsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={() => {
          setImportOpen(false);
          mutate();
        }}
      />
    </div>
  );
}
