import type { ModalProps as AntModalProps } from 'antd';
import { ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xxl';


export type ModalProps = {
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