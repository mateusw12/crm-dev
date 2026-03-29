'use client';

import { useEffect } from 'react';
import { Form, Input, Select, DatePicker, App } from 'antd';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import dayjs from 'dayjs';
import type { TaskResponse } from '@/lib/dto';
import { ContactsService, DealsService, TasksService } from '@/lib/services/index';
import { Modal } from '@/components/shared/Modal';

interface TaskModalProps {
  open: boolean;
  task: TaskResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TaskModal({ open, task, onClose, onSuccess }: TaskModalProps) {
  const [form] = Form.useForm();
  const tCommon = useTranslations('common');
  const t = useTranslations('tasks');
  const { message } = App.useApp();

  const { data: contacts } = useSWR('contacts-form', () =>
    ContactsService.getAll({ limit: 200 }).then((r) => r.data),
  );
  const { data: deals } = useSWR('deals-form', () => DealsService.getAll());

  useEffect(() => {
    if (open) {
      if (task) {
        form.setFieldsValue({
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.due_date ? dayjs(task.due_date) : undefined,
          contactId: task.contact_id,
          dealId: task.deal_id,
        });
      } else {
        form.resetFields();
        form.setFieldValue('status', 'PENDING');
      }
    }
  }, [open, task, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dueDate: values.dueDate?.toISOString(),
      };
      if (task) {
        await TasksService.update(task.id, payload);
      } else {
        await TasksService.create(payload);
      }
      message.success(tCommon('success'));
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      message.error(error?.message ?? tCommon('error'));
    }
  };

  return (
    <Modal open={open} title={task ? t('edit') : t('new')} onCancel={onClose} onSave={handleSubmit} saveLabel={tCommon('save')} cancelLabel={tCommon('cancel')}>
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="title" label={tCommon('title')} rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="description" label={tCommon('description')}><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="dueDate" label={t('dueDate')}><DatePicker style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="status" label={tCommon('status')}>
          <Select options={[{ value: 'PENDING', label: t('status.PENDING') }, { value: 'DONE', label: t('status.DONE') }]} />
        </Form.Item>
        <Form.Item name="contactId" label={useTranslations('contacts')('title')}>
          <Select allowClear showSearch optionFilterProp="label" options={(contacts ?? []).map((c: any) => ({ value: c.id, label: c.name }))} />
        </Form.Item>
        <Form.Item name="dealId" label={useTranslations('deals')('title')}>
          <Select allowClear showSearch optionFilterProp="label" options={(deals ?? []).map((d: any) => ({ value: d.id, label: d.title }))} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
