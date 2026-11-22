import { ButtonLink } from '@/components/ui/Button';
import { PageShell } from '@/components/layout/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl text-center">
        <PageHeader eyebrow="Not found" title="This page has wandered off." />
        <p className="mx-auto mt-6 max-w-[40ch] text-[15px] leading-relaxed text-cocoa/70">
          The link may be old. Everything else is right where you left it.
        </p>
        <ButtonLink href="/" className="mt-12">
          Back to Lumi Lane
        </ButtonLink>
      </div>
    </PageShell>
  );
}
