'use client';

import { Modal as AntModal } from 'antd';
import type { ModalProps as AntModalProps } from 'antd';
import type { ReactNode } from 'react';
import { ButtonGroup } from './ButtonGroup';

type ModalSize = 'sm' | 'md' | 'lg' | 'xxl';

const SIZE_MAP: Record<ModalSize, number> = {
  sm: 300,
  md: 500,
  lg: 800,
  xxl: 1140,
};

type ModalProps = {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  size?: ModalSize;
  width?: number | string;

  // loading / disabled state forwarded to ButtonGroup
  loadingSave?: boolean;
  disableSave?: boolean;
  disableCancel?: boolean;

  // labels
  saveLabel?: string;
  cancelLabel?: string;
  clearFilterLabel?: string;

  // visibility
  showSave?: boolean;
  showCancel?: boolean;
  showClearFilter?: boolean;

  // callbacks
  onSave?: () => void;
  onCancel?: () => void;
  onClearFilter?: () => void;

  // escape / mask close maps to onCancel
  maskClosable?: boolean;

  /** Pass extra Modal props when needed */
  modalProps?: Omit<
    AntModalProps,
    'open' | 'title' | 'footer' | 'onCancel' | 'children' | 'width'
  >;
};

export function Modal({
  open,
  title,
  children,
  size = 'md',
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
