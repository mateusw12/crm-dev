"use client";

import { useEffect, useRef } from "react";
import { Form, Input, Select } from "antd";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import type { ContactResponse } from "@/lib/dto";
import { CompaniesService } from "@/lib/services/companies.service";
import { ContactsService } from "@/lib/services/contacts.service";
import { Modal } from "@/components/shared/modal/Modal";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import {
  showSuccess,
  showUpdate,
} from "@/components/shared/notification/notificationService";
import { handleApiError } from "@/lib/api";
import { showConfirmUpdate } from "../shared/confirm/confirmService";

interface ContactModalProps {
  open: boolean;
  contact: ContactResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ContactModal({
  open,
  contact,
  onClose,
  onSuccess,
}: ContactModalProps) {
  const [form] = Form.useForm();
  const tCommon = useTranslations("common");
  const t = useTranslations("contacts");
  const avatarUrlRef = useRef<string | undefined>(contact?.avatar_url);

  const { data: companies } = useSWR(
    "companies-selector",
    () => CompaniesService.getAll({ limit: 200 }),
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (open) {
      avatarUrlRef.current = contact?.avatar_url;
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
      const payload = { ...values, avatarUrl: avatarUrlRef.current };
      if (contact) {
        const confirmed = await showConfirmUpdate();
        if (!confirmed) return;
        await ContactsService.update(contact.id, payload);
        showUpdate();
      } else {
        await ContactsService.create(payload);
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
      title={contact ? t("edit") : t("new")}
      onCancel={onClose}
      onSave={handleSubmit}
      saveLabel={tCommon("save")}
      cancelLabel={tCommon("cancel")}
      width={560}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <AvatarUpload
            value={contact?.avatar_url}
            entityType="contacts"
            entityId={contact?.id ?? "new"}
            field="avatar"
            name={contact?.name}
            onUploaded={(url) => { avatarUrlRef.current = url; }}
          />
        </div>
        <Form.Item
          name="name"
          label={tCommon("name")}
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label={tCommon("email")}
          rules={[{ type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phone" label={tCommon("phone")}>
          <Input />
        </Form.Item>
        <Form.Item name="companyId" label={t("company")}>
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            options={(companies?.data ?? []).map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </Form.Item>
        <Form.Item name="notes" label={tCommon("notes")}>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
