'use client';

import { useEffect, useRef, useState } from 'react';
import { Form, Input, Row, Col, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import type { CompanyResponse } from '@/lib/dto';
import { CompaniesService } from '@/lib/services/index';
import { Modal } from '@/components/shared/modal/Modal';
import { isValidCnpj, maskCnpj, cleanCnpj } from '@/utils/cnpj';
import { maskCep, cleanCep, isValidCep } from '@/utils/cep';
import { showSuccess, showUpdate } from '@/components/shared/notification/notificationService';
import { handleApiError } from '@/lib/api';

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
  const [cepLoading, setCepLoading] = useState(false);
  const cepAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      if (company) {
        form.setFieldsValue({
          ...company,
          cnpj: company.cnpj ? maskCnpj(company.cnpj) : '',
          cep: company.cep ? maskCep(company.cep) : '',
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, company, form]);

  const handleCepBlur = async (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 8) return;

    cepAbortRef.current?.abort();
    cepAbortRef.current = new AbortController();
    setCepLoading(true);
    try {
      const data = await CompaniesService.lookupCep(digits);
      const parts = [data.street, data.neighborhood, data.city, data.state]
        .filter(Boolean)
        .join(', ');
      form.setFieldsValue({ address: parts });
      form.setFields([{ name: 'cep', errors: [] }]);
    } catch {
      form.setFields([{ name: 'cep', errors: [t('cepNotFound')] }]);
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        cnpj: cleanCnpj(values.cnpj),
        cep: cleanCep(values.cep),
      };
      if (company) {
        await CompaniesService.update(company.id, payload);
        showUpdate();
      } else {
        await CompaniesService.create(payload);
        showSuccess();
      }
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      // Show duplicate CNPJ as a field error instead of a generic notification
      if (error?.message === 'error.cnpjDuplicate') {
        form.setFields([{ name: 'cnpj', errors: [t('cnpjDuplicate')] }]);
      } else {
        handleApiError(error);
      }
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
      size='lg'
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="name" label={tCommon('name')} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="cnpj"
              label={t('cnpj')}
              rules={[
                { required: true },
                {
                  validator: (_, value) =>
                    !value || isValidCnpj(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error(t('cnpjInvalid'))),
                },
              ]}
            >
              <Input
                placeholder="00.000.000/0000-00"
                onChange={(e) => {
                  form.setFieldValue('cnpj', maskCnpj(e.target.value));
                }}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="cep"
              label={t('cep')}
              rules={[
                { required: true },
                {
                  validator: (_, value) =>
                    !value || isValidCep(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error('CEP deve ter 8 dígitos')),
                },
              ]}
            >
              <Input
                placeholder="00000-000"
                suffix={cepLoading ? <Spin size="small" /> : null}
                onChange={(e) => {
                  form.setFieldValue('cep', maskCep(e.target.value));
                }}
                onBlur={(e) => handleCepBlur(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="address" label={t('address')}>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="industry" label={t('industry')}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label={tCommon('phone')}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="website" label={t('website')}>
          <Input placeholder="https://" />
        </Form.Item>

        <Form.Item name="notes" label={tCommon('notes')}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

