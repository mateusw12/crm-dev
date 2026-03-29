"use client";

import { useState } from "react";
import { Upload, Avatar, Tooltip, App } from "antd";
import { CameraOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { UploadsService } from "@/lib/services/uploads.service";

interface AvatarUploadProps {
  /** Current URL (from entity) */
  value?: string;
  /** Triggered after a successful upload with the new public URL */
  onUploaded: (url: string) => void;
  entityType: string;
  /** Required when the entity already exists; for new entities pass "new" */
  entityId: string;
  field?: string;
  size?: number;
  shape?: "circle" | "square";
  /** Optional display name used for initials fallback */
  name?: string;
}

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function AvatarUpload({
  value,
  onUploaded,
  entityType,
  entityId,
  field = "avatar",
  size = 80,
  shape = "circle",
  name,
}: AvatarUploadProps) {
  const { message } = App.useApp();
  const t = useTranslations("uploads");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleBeforeUpload = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      message.error(t("invalidImageType"));
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      message.error(t("fileTooLarge", { max: MAX_SIZE_MB }));
      return false;
    }

    setLoading(true);
    try {
      const result = await UploadsService.upload(file, entityType, entityId, field);
      setPreview(result.url);
      onUploaded(result.url);
      message.success(t("uploadSuccess"));
    } catch {
      message.error(t("uploadError"));
    } finally {
      setLoading(false);
    }
    // Prevent antd from doing its own upload
    return false;
  };

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : undefined;

  return (
    <Upload
      accept={ALLOWED_TYPES.join(",")}
      showUploadList={false}
      beforeUpload={handleBeforeUpload}
    >
      <Tooltip title={t("clickToUpload")}>
        <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>
          <Avatar
            size={size}
            shape={shape}
            src={preview || undefined}
            icon={!preview && !initials ? <UserOutlined /> : undefined}
            style={{ backgroundColor: preview ? undefined : "#1677ff" }}
          >
            {!preview && initials}
          </Avatar>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "rgba(0,0,0,0.55)",
              borderRadius: shape === "circle" ? "50%" : 4,
              width: Math.round(size * 0.38),
              height: Math.round(size * 0.38),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: Math.round(size * 0.18),
            }}
          >
            {loading ? <LoadingOutlined /> : <CameraOutlined />}
          </div>
        </div>
      </Tooltip>
    </Upload>
  );
}
