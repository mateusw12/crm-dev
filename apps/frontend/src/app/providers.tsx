'use client';

import { SessionProvider } from 'next-auth/react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import type { ReactNode } from 'react';
import { ConfirmProvider } from '@/components/shared/confirm/ConfirmProvider';
import { NotificationProvider } from '@/components/shared/notification/NotificationProvider';

interface ProvidersProps {
  children: ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#6366f1',
                borderRadius: 8,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              },
              components: {
                Layout: {
                  siderBg: '#0f172a',
                  triggerBg: '#1e293b',
                },
              },
            }}
          >
            <App>
              <NotificationProvider>
                <ConfirmProvider>{children}</ConfirmProvider>
              </NotificationProvider>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
