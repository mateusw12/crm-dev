'use client';

import { CloseOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { GenericButton } from './GenericButton';

type CancelButtonProps = {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: ButtonProps['size'];
};

export function CancelButton({
  label,
  icon = <CloseOutlined />,
  onClick,
  disabled = false,
  size,
}: CancelButtonProps) {
  const t = useTranslations('common');
  return (
    <GenericButton
      buttonStyle="cancel"
      icon={icon}
      label={label ?? t('cancel')}
      onClick={onClick}
      disabled={disabled}
      size={size}
    />
  );
}
