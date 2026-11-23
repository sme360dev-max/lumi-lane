import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccountForm } from '@/features/account/AccountForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Member login for Lumi Lane.',
  alternates: { canonical: '/login/' },
};

export default function LoginPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="Lumi Lane membership" title="Login">
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-cocoa/75">
          Online member access is coming soon.
        </p>
      </PageHeader>
      <AccountForm mode="login" />
    </PageShell>
  );
}
