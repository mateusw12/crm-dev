'use client';

import type { ReactNode } from 'react';

export type ConfirmOptions = {
  title?: ReactNode;
  content?: ReactNode;
  okText?: string;
  cancelText?: string;
  okDanger?: boolean;
  width?: number | string;
};

type ConfirmHandler = (opts: ConfirmOptions) => Promise<boolean>;

let handler: ConfirmHandler | null = null;
let defaults: {
  deleteTitle?: string;
  deleteContent?: string;
  deleteOk?: string;
  deleteCancel?: string;
  updateTitle?: string;
  updateContent?: string;
  updateOk?: string;
  updateCancel?: string;
} = {};

export function registerConfirmHandler(h: ConfirmHandler) {
  handler = h;
}

export function unregisterConfirmHandler() {
  handler = null;
}

export function setDefaultConfirmTexts(d: typeof defaults) {
  defaults = { ...defaults, ...d };
}

export async function showConfirmGeneric(opts: ConfirmOptions): Promise<boolean> {
  if (!handler) throw new Error('ConfirmProvider not registered');
  return handler(opts);
}

export async function showConfirmDelete(opts?: ConfirmOptions): Promise<boolean> {
  const merged: ConfirmOptions = {
    title: defaults.deleteTitle,
    content: defaults.deleteContent,
    okText: defaults.deleteOk,
    cancelText: defaults.deleteCancel,
    okDanger: true,
    ...opts,
  };
  return showConfirmGeneric(merged);
}

export async function showConfirmUpdate(opts?: ConfirmOptions): Promise<boolean> {
  const merged: ConfirmOptions = {
    title: defaults.updateTitle,
    content: defaults.updateContent,
    okText: defaults.updateOk,
    cancelText: defaults.updateCancel,
    okDanger: false,
    ...opts,
  };
  return showConfirmGeneric(merged);
}
