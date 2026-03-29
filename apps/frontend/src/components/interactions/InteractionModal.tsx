'use client';

import { useEffect } from 'react';
import { Form, Input, Select, DatePicker, App } from 'antd';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import type { InteractionResponse } from '@/lib/dto';
import { InteractionsService } from '@/lib/services/index';
import { Modal } from '@/components/shared/Modal';

interface InteractionModalProps {
  open: boolean;
  contactId: string;
  interaction?: InteractionResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

const INTERACTION_TYPES = ['CALL', 'EMAIL', 'MEETING'];

export function InteractionModal({
  open,
  contactId,
  interaction,
  onClose,
  onSuccess,
}: InteractionModalProps) {
  const [form] = Form.useForm();
  const tCommon = useTranslations('common');
  const t = useTranslations('interactions');
  const { message } = App.useApp();

  useEffect(() => {
    if (open) {
      if (interaction) {
        form.setFieldsValue({
          type: interaction.type,
          description: interaction.description,
          date: dayjs(interaction.date),
        });
      } else {
        form.resetFields();
        form.setFieldValue('date', dayjs());
      }
    }
  }, [open, interaction, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        date: values.date.toISOString(),
        contactId,
      };
      if (interaction) {
        await InteractionsService.update(interaction.id, payload);
      } else {
        await InteractionsService.create(payload);
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
      title={interaction ? t('edit') : t('new')}
      onCancel={onClose}
      onSave={handleSubmit}
      saveLabel={tCommon('save')}
      cancelLabel={tCommon('cancel')}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="type"
          label={tCommon('type')}
          rules={[{ required: true }]}
        >
          <Select
            options={INTERACTION_TYPES.map((type) => ({
              value: type,
              label: t(`type.${type}`),
            }))}
          />
        </Form.Item>
        <Form.Item name="date" label={tCommon('date')} rules={[{ required: true }]}>
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="description"
          label={tCommon('description')}
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
