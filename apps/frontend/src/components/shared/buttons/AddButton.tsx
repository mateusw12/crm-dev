'use client';

import { PlusOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { GenericButton } from './GenericButton';

type AddButtonProps = {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonProps['size'];
};

export function AddButton({
  label,
  icon = <PlusOutlined />,
  onClick,
  disabled = false,
  loading = false,
  size,
}: AddButtonProps) {
  const t = useTranslations('common');
  return (
    <GenericButton
      buttonStyle="add"
      icon={icon}
      label={label ?? t('add')}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      size={size}
    />
  );
}
