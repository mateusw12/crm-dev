'use client';

import { useState } from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import type { ButtonStyleVariant } from './buttonStyles';
import { getButtonStyle } from './buttonStyles';

type GenericButtonProps = Omit<ButtonProps, 'children' | 'type' | 'style'> & {
  label?: string;
  buttonStyle?: ButtonStyleVariant;
  /** Falls back to antd type when no buttonStyle is provided */
  type?: ButtonProps['type'];
};

export function GenericButton({ label, buttonStyle, type, style, ...rest }: GenericButtonProps & { style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);

  const computedStyle = buttonStyle
    ? { ...getButtonStyle(buttonStyle, hovered), ...style }
    : style;

  return (
    <Button
      type={buttonStyle ? undefined : type}
      style={computedStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {label}
    </Button>
  );
}
