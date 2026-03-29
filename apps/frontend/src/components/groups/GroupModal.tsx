"use client";

import { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import type { GroupResponse, UserResponse } from "@/lib/dto";
import { GroupsService } from "@/lib/services/groups.service";
import { UsersService } from "@/lib/services/users.service";
import { AuthService } from "@/lib/services/auth.service";
import { Modal } from "@/components/shared/modal/Modal";
import {
  showSuccess,
  showUpdate,
} from "@/components/shared/notification/notificationService";
import { handleApiError } from "@/lib/api";
import { showConfirmUpdate } from "../shared/confirm/confirmService";

interface GroupModalProps {
  open: boolean;
  group: GroupResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function GroupModal({
  open,
  group,
  onClose,
  onSuccess,
}: GroupModalProps) {
  const [form] = Form.useForm();
  const tCommon = useTranslations("common");
  const t = useTranslations("groups");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const { data: users = [] } = useSWR<UserResponse[]>(
    "users",
    UsersService.getAll,
  );

  // Pre-fill managerId with the current DB user's UUID on create
  useEffect(() => {
    if (!open) return;
    if (group) {
      form.setFieldsValue({
        name: group.name,
        description: group.description,
        managerId: group.manager_id,
      });
      setSelectedMembers((group.group_members ?? []).map((m) => m.user_id));
    } else {
      form.resetFields();
      setSelectedMembers([]);
      AuthService.getUser()
        .then((me) => form.setFieldValue("managerId", me.id))
        .catch(() => {});
    }
  }, [open, group, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let savedGroup: GroupResponse;

      if (group) {
        const confirmed = await showConfirmUpdate();
        if (!confirmed) return;
        
        savedGroup = await GroupsService.update(group.id, values);
        showUpdate();

        // Sync members: add new ones, remove removed ones
        const { toAdd, toRemove } = getMembershipChanges(
          group,
          selectedMembers,
        );

        await Promise.all([
          ...toAdd.map((userId) => GroupsService.addMember(group.id, userId)),
          ...toRemove.map((userId) =>
            GroupsService.removeMember(group.id, userId),
          ),
        ]);
      } else {
        savedGroup = await GroupsService.create(values);
        showSuccess();
        // Add all selected members — guard against non-UUID values
        const validMembers = selectedMembers.filter((id) =>
          UUID_REGEX.test(id),
        );
        await Promise.all(
          validMembers.map((userId) =>
            GroupsService.addMember(savedGroup.id, userId),
          ),
        );
      }

      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      handleApiError(error);
    }
  };

  const userOptions = users.map((u) => ({
    label: u.name ?? u.email,
    value: u.id,
  }));

  function getMembershipChanges(
    group: GroupResponse,
    selectedMembers: string[],
  ) {
    const currentMemberIds = (group.group_members ?? []).map((m) => m.user_id);
    const validSelected = selectedMembers.filter((id) => UUID_REGEX.test(id));
    const toAdd = validSelected.filter((id) => !currentMemberIds.includes(id));
    const toRemove = currentMemberIds.filter(
      (id) => !validSelected.includes(id),
    );
    return { toAdd, toRemove };
  }

  return (
    <Modal
      open={open}
      title={group ? t("edit") : t("new")}
      onCancel={onClose}
      onSave={handleSubmit}
      saveLabel={tCommon("save")}
      cancelLabel={tCommon("cancel")}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="name"
          label={tCommon("name")}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label={tCommon("description")}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="managerId"
          label={t("manager")}
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            options={userOptions}
            filterOption={(input, option) =>
              ((option?.label as string) ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            placeholder={t("manager")}
          />
        </Form.Item>

        <Form.Item label={t("members")}>
          <Select
            mode="multiple"
            allowClear
            value={selectedMembers}
            onChange={setSelectedMembers}
            options={userOptions}
            filterOption={(input, option) =>
              ((option?.label as string) ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            placeholder={t("members")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
