'use client';

import { useEffect } from 'react';
import { notification } from 'antd';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import {
  registerNotificationHandlers,
  unregisterNotificationHandlers,
} from './notificationService';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [api, contextHolder] = notification.useNotification();
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');
  const tNotifications = useTranslations('notifications');

  useEffect(() => {
    registerNotificationHandlers({
      showSuccess: (opts) => {
        api.success({
          message: tNotifications('successTitle'),
          description: opts?.description,
        });
      },

      showUpdate: (opts) => {
        api.success({
          message: tNotifications('updateTitle'),
          description: opts?.description,
        });
      },

      showError: (opts) => {
        let description: string | undefined = opts?.description;

        if (opts?.messageKey) {
          // Strip the "error." prefix sent by the backend
          const key = opts.messageKey.startsWith('error.')
            ? opts.messageKey.slice(6)
            : opts.messageKey;
          try {
            description = tErrors(key as any);
          } catch {
            // Key not in translations — fall back to the raw key
            description = opts.messageKey;
          }
        }

        api.error({
          message: tCommon('error'),
          description: description ?? tErrors('default'),
        });
      },

      showGeneric: (opts) => {
        api.info({
          message: opts.message,
          description: opts.description,
        });
      },
    });

    return () => unregisterNotificationHandlers();
  }, [api, tCommon, tErrors, tNotifications]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
}
