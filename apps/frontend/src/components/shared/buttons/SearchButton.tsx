'use client';

import { SearchOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { GenericButton } from './GenericButton';

type SearchButtonProps = {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonProps['size'];
};

export function SearchButton({
  label,
  icon = <SearchOutlined />,
  onClick,
  disabled = false,
  loading = false,
  size,
}: SearchButtonProps) {
  const t = useTranslations('common');
  return (
    <GenericButton
      buttonStyle="search"
      icon={icon}
      label={label ?? t('search')}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      size={size}
    />
  );
}
