import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { BookingForm } from '@/features/booking/BookingForm';

export const metadata: Metadata = {
  title: 'Book a Table',
  description: 'Book a table or enquire about catering and private functions at Lumi Lane in Lightsview.',
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
