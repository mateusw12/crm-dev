import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'CRM', template: '%s | CRM' },
  description: 'Modern CRM for managing contacts, deals and pipelines',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const locale = cookieStore.get('locale')?.value ?? 'en';
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
