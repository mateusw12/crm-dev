'use client';

import { Space } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { SaveButton, CancelButton, ClearButton } from './buttons';

type ButtonGroupProps = {
  // labels
  cancelLabel?: string;
  clearFilterLabel?: string;
  saveLabel?: string;

  // icons
  cancelIcon?: ReactNode;
  clearFilterIcon?: ReactNode;
  saveIcon?: ReactNode;

  // visibility (clearFilter hidden by default)
  showCancel?: boolean;
  showClearFilter?: boolean;
  showSave?: boolean;

  // disabled state
  disableCancel?: boolean;
  disableClearFilter?: boolean;
  disableSave?: boolean;

  // loading state (save commonly needs it)
  loadingSave?: boolean;

  // callbacks
  onCancel?: () => void;
  onClearFilter?: () => void;
  onSave?: () => void;
};

export function ButtonGroup({
  cancelLabel = 'Cancel',
  clearFilterLabel = 'Clear Filter',
  saveLabel = 'Save',
  cancelIcon,
  clearFilterIcon = <ClearOutlined />,
  saveIcon,
  showCancel = true,
  showClearFilter = false,
  showSave = true,
  disableCancel = false,
  disableClearFilter = false,
  disableSave = false,
  loadingSave = false,
  onCancel,
  onClearFilter,
  onSave,
}: ButtonGroupProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Space>
        {showClearFilter && (
          <ClearButton
            label={clearFilterLabel}
            icon={clearFilterIcon}
            onClick={onClearFilter}
            disabled={disableClearFilter}
          />
        )}
        {showCancel && (
          <CancelButton
            label={cancelLabel}
            icon={cancelIcon}
            onClick={onCancel}
            disabled={disableCancel}
          />
        )}
        {showSave && (
          <SaveButton
            label={saveLabel}
            icon={saveIcon}
            onClick={onSave}
            disabled={disableSave}
            loading={loadingSave}
          />
        )}
      </Space>
    </div>
  );
}
