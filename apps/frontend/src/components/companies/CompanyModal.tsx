'use client';

import { useEffect } from 'react';
import { Form, Input, App } from 'antd';
import { useTranslations } from 'next-intl';
import type { CompanyResponse } from '@/lib/dto';
import { CompaniesService } from '@/lib/services/index';
import { Modal } from '@/components/shared/Modal';

interface CompanyModalProps {
  open: boolean;
  company: CompanyResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CompanyModal({ open, company, onClose, onSuccess }: CompanyModalProps) {
  const [form] = Form.useForm();
  const tCommon = useTranslations('common');
  const t = useTranslations('companies');
  const { message } = App.useApp();

  useEffect(() => {
    if (open) {
      company ? form.setFieldsValue(company) : form.resetFields();
    }
  }, [open, company, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (company) {
        await CompaniesService.update(company.id, values);
      } else {
        await CompaniesService.create(values);
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
      title={company ? t('edit') : t('new')}
      onCancel={onClose}
      onSave={handleSubmit}
      saveLabel={tCommon('save')}
      cancelLabel={tCommon('cancel')}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="name" label={tCommon('name')} rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="industry" label={t('industry')}><Input /></Form.Item>
        <Form.Item name="website" label={t('website')}><Input /></Form.Item>
        <Form.Item name="phone" label={tCommon('phone')}><Input /></Form.Item>
        <Form.Item name="address" label={t('address')}><Input /></Form.Item>
        <Form.Item name="notes" label={tCommon('notes')}><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  );
}
