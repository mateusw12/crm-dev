'use client';

import { useEffect } from 'react';
import { Form, Input, App } from 'antd';
import { useTranslations } from 'next-intl';
import type { GroupResponse } from '@/lib/dto';
import { GroupsService } from '@/lib/services/groups.service';
import { Modal } from '@/components/shared/Modal';

interface GroupModalProps {
  open: boolean;
  group: GroupResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function GroupModal({ open, group, onClose, onSuccess }: GroupModalProps) {
  const [form] = Form.useForm();
  const tCommon = useTranslations('common');
  const t = useTranslations('groups');
  const { message } = App.useApp();

  useEffect(() => {
    if (open) {
      group
        ? form.setFieldsValue({ name: group.name, description: group.description, managerId: group.manager_id })
        : form.resetFields();
    }
  }, [open, group, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (group) {
        await GroupsService.update(group.id, values);
      } else {
        await GroupsService.create(values);
      }
      message.success(tCommon('success'));
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      message.error(error?.message ?? tCommon('error'));
    }
  };

  return (
    <Modal open={open} title={group ? t('edit') : t('new')} onCancel={onClose} onSave={handleSubmit} saveLabel={tCommon('save')} cancelLabel={tCommon('cancel')}>
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="name" label={tCommon('name')} rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="description" label={tCommon('description')}><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="managerId" label={t('manager')} rules={[{ required: true }]}><Input placeholder="Manager user ID" /></Form.Item>
      </Form>
    </Modal>
  );
}
