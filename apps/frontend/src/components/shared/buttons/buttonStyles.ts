import type { CSSProperties } from 'react';

export type ButtonStyleVariant =
  | 'add'
  | 'edit'
  | 'save'
  | 'search'
  | 'clearFilter'
  | 'cancel'
  | 'remove';

type StyleConfig = {
  background: string;
  color: string;
  borderColor: string;
  hoverBackground: string;
  hoverBorderColor: string;
  hoverColor: string;
};

const styleMap: Record<ButtonStyleVariant, StyleConfig> = {
  add: {
    background: '#4096ff',
    color: '#fff',
    borderColor: '#4096ff',
    hoverBackground: '#1677ff',
    hoverBorderColor: '#1677ff',
    hoverColor: '#fff',
  },
  edit: {
    background: '#1677ff',
    color: '#fff',
    borderColor: '#1677ff',
    hoverBackground: '#0958d9',
    hoverBorderColor: '#0958d9',
    hoverColor: '#fff',
  },
  save: {
    background: '#28a745',
    color: '#fff',
    borderColor: '#28a745',
    hoverBackground: '#218838',
    hoverBorderColor: '#1e7e34',
    hoverColor: '#fff',
  },
  search: {
    background: '#0050b3',
    color: '#fff',
    borderColor: '#0050b3',
    hoverBackground: '#003a8c',
    hoverBorderColor: '#003a8c',
    hoverColor: '#fff',
  },
  clearFilter: {
    background: '#bae0ff',
    color: '#0958d9',
    borderColor: '#91caff',
    hoverBackground: '#91caff',
    hoverBorderColor: '#4096ff',
    hoverColor: '#0050b3',
  },
  cancel: {
    background: '#ff4d4f',
    color: '#fff',
    borderColor: '#ff4d4f',
    hoverBackground: '#ff7875',
    hoverBorderColor: '#ff7875',
    hoverColor: '#fff',
  },
  remove: {
    background: '#ff4d4f',
    color: '#fff',
    borderColor: '#ff4d4f',
    hoverBackground: '#ff7875',
    hoverBorderColor: '#ff7875',
    hoverColor: '#fff',
  },
};

export function getButtonStyle(
  variant: ButtonStyleVariant,
  isHovered: boolean,
): CSSProperties {
  const config = styleMap[variant];
  return {
    background: isHovered ? config.hoverBackground : config.background,
    color: isHovered ? config.hoverColor : config.color,
    borderColor: isHovered ? config.hoverBorderColor : config.borderColor,
    transition: 'background 0.2s, border-color 0.2s, color 0.2s',
  };
}
