"use client";

import { useState, useCallback } from "react";
import { Upload, List, Button, App, Typography, Tooltip, Space } from "antd";
import {
  PaperClipOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { AttachmentsService, type AttachmentItem } from "@/lib/services/attachments.service";
import { handleApiError } from "@/lib/api";

const MAX_SIZE_MB = 10;

interface AttachmentsPanelProps {
  entityType: string;
  entityId: string;
}

function formatBytes(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentsPanel({ entityType, entityId }: AttachmentsPanelProps) {
  const { message, modal } = App.useApp();
  const t = useTranslations("uploads");
  const [uploading, setUploading] = useState(false);

  const { data: attachments = [], mutate } = useSWR<AttachmentItem[]>(
    entityId ? `attachments-${entityType}-${entityId}` : null,
    () => AttachmentsService.getByEntity(entityType, entityId),
  );

  const handleBeforeUpload = useCallback(
    async (file: File) => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        message.error(t("fileTooLarge", { max: MAX_SIZE_MB }));
        return false;
      }
      setUploading(true);
      try {
        await AttachmentsService.upload(file, entityType, entityId);
        await mutate();
        message.success(t("uploadSuccess"));
      } catch (err) {
        handleApiError(err);
      } finally {
        setUploading(false);
      }
      return false;
    },
    [entityType, entityId, message, mutate, t],
  );

  const handleDelete = useCallback(
    (item: AttachmentItem) => {
      modal.confirm({
        title: t("deleteAttachment"),
        content: item.filename,
        okText: t("confirmDelete"),
        cancelText: t("cancel"),
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await AttachmentsService.remove(item.id);
            await mutate();
          } catch (err) {
            handleApiError(err);
          }
        },
      });
    },
    [modal, mutate, t],
  );

  return (
    <div>
      <Space style={{ marginBottom: 8 }} align="center">
        <Typography.Text strong>{t("attachments")}</Typography.Text>
        <Upload
          accept="*/*"
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
        >
          <Button
            size="small"
            icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
            disabled={uploading}
          >
            {t("addAttachment")}
          </Button>
        </Upload>
      </Space>

      {attachments.length === 0 ? (
        <Typography.Text type="secondary" style={{ display: "block", fontSize: 12 }}>
          {t("noAttachments")}
        </Typography.Text>
      ) : (
        <List
          size="small"
          dataSource={attachments}
          renderItem={(item) => (
            <List.Item
              style={{ padding: "4px 0" }}
              actions={[
                <Tooltip key="download" title={t("download")}>
                  <Button
                    type="link"
                    size="small"
                    icon={<DownloadOutlined />}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  />
                </Tooltip>,
                <Tooltip key="delete" title={t("delete")}>
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item)}
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={<PaperClipOutlined />}
                title={
                  <Typography.Text ellipsis style={{ maxWidth: 260 }}>
                    {item.filename}
                  </Typography.Text>
                }
                description={
                  <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    {formatBytes(item.size)}
                    {item.content_type ? ` · ${item.content_type.split("/")[1]}` : ""}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
