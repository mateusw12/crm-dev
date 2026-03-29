'use client';

import { ClearOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { GenericButton } from './GenericButton';

type ClearButtonProps = {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: ButtonProps['size'];
};

export function ClearButton({
  label,
  icon = <ClearOutlined />,
  onClick,
  disabled = false,
  size,
}: ClearButtonProps) {
  const t = useTranslations('common');
  return (
    <GenericButton
      buttonStyle="clearFilter"
      icon={icon}
      label={label ?? t('clearFilter')}
      onClick={onClick}
      disabled={disabled}
      size={size}
    />
  );
}
