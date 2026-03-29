'use client';

import { EditOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { GenericButton } from './GenericButton';

type EditButtonProps = {
  label?: string;
  showLabel?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonProps['size'];
};

export function EditButton({
  label,
  showLabel = true,
  icon = <EditOutlined />,
  onClick,
  disabled = false,
  loading = false,
  size,
}: EditButtonProps) {
  const t = useTranslations('common');
  return (
    <GenericButton
      buttonStyle="edit"
      icon={icon}
      label={label ?? t('edit')}
      showLabel={showLabel}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      size={size}
    />
  );
}
