"use client";

import { Modal as AntModal } from "antd";
import { ButtonGroup } from "../ButtonGroup";
import { ModalProps, ModalSize } from "./modal.interface";

const SIZE_MAP: Record<ModalSize, number> = {
  sm: 340,
  md: 520,
  lg: 720,
  xxl: 1100,
};

export function Modal({
  open,
  title,
  children,
  size = "md",
  width,
  loadingSave = false,
  disableSave = false,
  disableCancel = false,
  saveLabel,
  cancelLabel,
  clearFilterLabel,
  showSave = true,
  showCancel = true,
  showClearFilter = false,
  onSave,
  onCancel,
  onClearFilter,
  maskClosable = false,
  modalProps,
}: ModalProps) {
  const resolvedWidth = width ?? SIZE_MAP[size];

  return (
    <AntModal
      open={open}
      title={title}
      width={resolvedWidth}
      onCancel={onCancel}
      maskClosable={maskClosable}
      style={{ top: 20 }}
      styles={{ body: { maxHeight: "calc(100vh - 200px)", overflowY: "auto" } }}
      footer={
        <ButtonGroup
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
          clearFilterLabel={clearFilterLabel}
          showSave={showSave}
          showCancel={showCancel}
          showClearFilter={showClearFilter}
          loadingSave={loadingSave}
          disableSave={disableSave}
          disableCancel={disableCancel}
          onSave={onSave}
          onCancel={onCancel}
          onClearFilter={onClearFilter}
        />
      }
      destroyOnHidden
      {...modalProps}
    >
      {children}
    </AntModal>
  );
}
