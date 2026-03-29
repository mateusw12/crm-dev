'use client';

import { useEffect } from 'react';
import { Form, Input, Select, App } from 'antd';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { ContactResponse } from '@/lib/dto';
import { CompaniesService } from '@/lib/services/companies.service';
import { ContactsService } from '@/lib/services/contacts.service';
import { Modal } from '@/components/shared/Modal';

interface ContactModalProps {
  open: boolean;
  contact: ContactResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ContactModal({ open, contact, onClose, onSuccess }: ContactModalProps) {
  const [form] = Form.useForm();
  const tCommon = useTranslations('common');
  const t = useTranslations('contacts');
  const { message } = App.useApp();

  const { data: companies } = useSWR('companies', () => CompaniesService.getAll());

  useEffect(() => {
    if (open) {
      if (contact) {
        form.setFieldsValue({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          companyId: contact.company_id,
          notes: contact.notes,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, contact, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (contact) {
        await ContactsService.update(contact.id, values);
      } else {
        await ContactsService.create(values);
      }
      message.success(tCommon('success'));
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      message.error(error?.message ?? tCommon('error'));
    }
  };

  return (
    <Modal
      open={open}
      title={contact ? t('edit') : t('new')}
      onCancel={onClose}
      onSave={handleSubmit}
      saveLabel={tCommon('save')}
      cancelLabel={tCommon('cancel')}
      width={560}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="name"
          label={tCommon('name')}
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="email" label={tCommon('email')} rules={[{ type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label={tCommon('phone')}>
          <Input />
        </Form.Item>
        <Form.Item name="companyId" label={t('company')}>
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            options={(companies ?? []).map((c: any) => ({ value: c.id, label: c.name }))}
          />
        </Form.Item>
        <Form.Item name="notes" label={tCommon('notes')}>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
