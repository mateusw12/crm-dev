'use client';

import { Popconfirm } from 'antd';
import type { ButtonProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { GenericButton } from './GenericButton';

type RemoveButtonProps = {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonProps['size'];
  confirmTitle?: string;
};

export function RemoveButton({
  label,
  icon = <DeleteOutlined />,
  onClick,
  disabled = false,
  loading = false,
  size,
  confirmTitle,
}: RemoveButtonProps) {
  const t = useTranslations('common');
  const btn = (
    <GenericButton
      buttonStyle="remove"
      icon={icon}
      label={label ?? t('remove')}
      onClick={confirmTitle ? undefined : onClick}
      disabled={disabled}
      loading={loading}
      size={size}
    />
  );

  if (confirmTitle) {
    return (
      <Popconfirm
        title={confirmTitle}
        onConfirm={onClick}
        okButtonProps={{ danger: true }}
        disabled={disabled}
      >
        {btn}
      </Popconfirm>
    );
  }

  return btn;
}
