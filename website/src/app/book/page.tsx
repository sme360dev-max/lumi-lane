import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { BookingForm } from '@/features/booking/BookingForm';

export const metadata: Metadata = {
  title: 'Book a Table',
  description: 'Plan a visit to Lumi Lane in Lightsview for breakfast, brunch, lunch, coffee or a drink.',
  alternates: { canonical: '/book/' },
};

export default function BookPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <BookingForm />
      </div>
    </PageShell>
  );
}
