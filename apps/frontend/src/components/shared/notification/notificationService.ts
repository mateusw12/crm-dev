'use client';

export type NotificationOpts = {
  description?: string;
};

export type ErrorNotificationOpts = {
  /** i18n key sent by the backend, e.g. "error.companyNotFound" */
  messageKey?: string;
  description?: string;
};

export type GenericNotificationOpts = {
  message: string;
  description?: string;
};

type Handlers = {
  showSuccess: (opts?: NotificationOpts) => void;
  showUpdate: (opts?: NotificationOpts) => void;
  showError: (opts?: ErrorNotificationOpts) => void;
  showGeneric: (opts: GenericNotificationOpts) => void;
};

let handlers: Handlers | null = null;

export function registerNotificationHandlers(h: Handlers) {
  handlers = h;
}

export function unregisterNotificationHandlers() {
  handlers = null;
}

export function showSuccess(opts?: NotificationOpts) {
  handlers?.showSuccess(opts);
}

export function showUpdate(opts?: NotificationOpts) {
  handlers?.showUpdate(opts);
}

export function showError(opts?: ErrorNotificationOpts) {
  handlers?.showError(opts);
}

export function showGeneric(opts: GenericNotificationOpts) {
  handlers?.showGeneric(opts);
}
