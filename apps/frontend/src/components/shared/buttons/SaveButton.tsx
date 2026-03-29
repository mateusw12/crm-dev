'use client';

import { SaveOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { GenericButton } from './GenericButton';

type SaveButtonProps = {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonProps['size'];
};

export function SaveButton({
  label,
  icon = <SaveOutlined />,
  onClick,
  disabled = false,
  loading = false,
  size,
}: SaveButtonProps) {
  const t = useTranslations('common');
  return (
    <GenericButton
      buttonStyle="save"
      icon={icon}
      label={label ?? t('save')}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      size={size}
    />
  );
}
