import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccountForm } from '@/features/account/AccountForm';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Member sign up for Lumi Lane.',
  alternates: { canonical: '/signup/' },
};

export default function SignupPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="Lumi Lane membership" title="Sign Up">
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-cocoa/75">
          Online registration is coming soon.
        </p>
      </PageHeader>
      <AccountForm mode="signup" />
    </PageShell>
  );
}
