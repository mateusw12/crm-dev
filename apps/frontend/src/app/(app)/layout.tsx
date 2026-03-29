import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect('/auth/signin');
  }

  return <AppLayout>{children}</AppLayout>;
}
