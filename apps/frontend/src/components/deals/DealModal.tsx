"use client";

import { useEffect } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import type { DealResponse } from "@/lib/dto";
import { DealStatus } from "@/lib/dto";
import { ContactsService, DealsService } from "@/lib/services/index";
import { Modal } from "@/components/shared/modal/Modal";
import {
  showSuccess,
  showUpdate,
} from "@/components/shared/notification/notificationService";
import { handleApiError } from "@/lib/api";
import { showConfirmUpdate } from "../shared/confirm/confirmService";

interface DealModalProps {
  open: boolean;
  deal: DealResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DEAL_STATUSES: DealStatus[] = [
  DealStatus.LEAD,
  DealStatus.CONTACTED,
  DealStatus.PROPOSAL,
  DealStatus.NEGOTIATION,
  DealStatus.WON,
  DealStatus.LOST,
];

export function DealModal({ open, deal, onClose, onSuccess }: DealModalProps) {
  const [form] = Form.useForm();
  const tCommon = useTranslations("common");
  const t = useTranslations("deals");

  const { data: contacts } = useSWR("contacts-all", () =>
    ContactsService.getAll({ limit: 200 }).then((r) => r.data),
  );

  useEffect(() => {
    if (open) {
      if (deal) {
        form.setFieldsValue({
          title: deal.title,
          value: deal.value,
          status: deal.status,
          contactId: deal.contact_id,
        });
      } else {
        form.resetFields();
        form.setFieldValue("status", "LEAD");
      }
    }
  }, [open, deal, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (deal) {
        const confirmed = await showConfirmUpdate();
        if (!confirmed) return;
        
        await DealsService.update(deal.id, values);
        showUpdate();
      } else {
        await DealsService.create(values);
        showSuccess();
      }
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      handleApiError(error);
    }
  };

  return (
    <Modal
      open={open}
      title={deal ? t("edit") : t("new")}
      onCancel={onClose}
      onSave={handleSubmit}
      saveLabel={tCommon("save")}
      cancelLabel={tCommon("cancel")}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="title"
          label={tCommon("title")}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="value" label={tCommon("value")}>
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            precision={2}
            prefix="$"
          />
        </Form.Item>
        <Form.Item
          name="status"
          label={tCommon("status")}
          rules={[{ required: true }]}
        >
          <Select
            options={DEAL_STATUSES.map((s) => ({
              value: s,
              label: t(`status.${s}`),
            }))}
          />
        </Form.Item>
        <Form.Item
          name="contactId"
          label={t("contact")}
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            options={(contacts ?? []).map((c: any) => ({
              value: c.id,
              label: c.name,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
