'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BUSINESS } from '@/data/business';
import { BOOK } from '@/data/content';
import { PageHeader } from '@/components/ui/PageHeader';
import { ButtonLink, buttonClass } from '@/components/ui/Button';
import { InkStamp } from '@/components/brand/InkStamp';
import { BookingField } from './BookingField';
import { ReservationSlip, SlipPaper, SlipRow } from './ReservationSlip';
import slipStyles from './Booking.module.css';
import {
  EMPTY_BOOKING,
  FIELD_ORDER,
  formatDate,
  formatTime,
  parseDate,
  parseTime,
  prettyDate,
  validateBooking,
  type BookingErrors,
  type BookingField as Field,
  type BookingValues,
} from './validation';

const REQUEST_TYPES = ['Table booking', 'Catering', 'Private function'] as const;
type RequestType = (typeof REQUEST_TYPES)[number];

/**
 * Submit table requests to Django and show confirmation only after the API saves the request.
 */
export function BookingForm() {
  const [requestType, setRequestType] = useState<RequestType>('Table booking');
  const isTable = requestType === 'Table booking';
  const notesPrefix = isTable ? '' : `Enquiry type: ${requestType}\n`;
  const [values, setValues] = useState<BookingValues>(EMPTY_BOOKING);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const requestId = useRef(crypto.randomUUID());
  const summaryRef = useRef<HTMLHeadingElement>(null);

  // Focus the summary heading once it has actually rendered (a rAF could fire before the commit).
  useEffect(() => {
    if (checked) summaryRef.current?.focus();
  }, [checked]);

  const set = (field: Field) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };
  const focusField = (field: Field) => document.getElementById(`book-${field}`)?.focus();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateBooking(values);
    const notes = `${notesPrefix}${values.notes.trim()}`.trim();
    if (notes.length > 2000) found.notes = `Please use ${2000 - notesPrefix.length} characters or fewer.`;
    setErrors(found);
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) {
      focusField(first);
      return;
    }
    const date = parseDate(values.date);
    const time = parseTime(values.time);
    if (!date || !time) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
    if (!apiUrl) {
      setRequestError('Online booking is not configured yet. Please call us to book.');
      return;
    }
    setSubmitting(true);
    setRequestError('');
    try {
      const response = await fetch(`${apiUrl}/api/bookings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: requestId.current,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          guests: values.guests.trim(),
          date: `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`,
          time: `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}`,
          notes,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        const fieldErrors = result.errors as BookingErrors | undefined;
        if (fieldErrors) setErrors(fieldErrors);
        setRequestError(result.error || 'We could not send your request. Please try again or call us.');
        return;
      }
      setValues((v) => ({ ...v, date: formatDate(date), time: formatTime(time) }));
      setChecked(true);
      window.scrollTo({ top: 0 });
    } catch {
      setRequestError('We could not reach the booking service. Please try again or call us.');
    } finally {
      setSubmitting(false);
    }
  };

  const edit = () => {
    setChecked(false);
    window.requestAnimationFrame(() => focusField('name'));
  };
  const reset = () => {
    setRequestType('Table booking');
    setValues(EMPTY_BOOKING);
    setErrors({});
    setRequestError('');
    requestId.current = crypto.randomUUID();
    edit();
  };

  if (checked) {
    const date = parseDate(values.date);
    const time = parseTime(values.time);
    const rows: [string, string][] = [
      ['Name', values.name.trim()],
      ['Guests', values.guests.trim()],
      ['When', `${date ? prettyDate(date) : values.date}, ${time ? formatTime(time) : values.time}`],
      ['Contact', `${values.email.trim()} · ${values.phone.trim()}`],
    ];
    if (!isTable) rows.unshift(['Enquiry', requestType]);
    if (values.notes.trim()) rows.push(['Requests', values.notes.trim()]);

    return (
      <div className="view-enter text-center" data-testid="booking-summary">
        <p className="font-script text-3xl text-ember sm:text-4xl">Thank you</p>
        <h1
          ref={summaryRef}
          tabIndex={-1}
          className="mx-auto mt-6 max-w-[18ch] font-serif text-[clamp(2rem,5.2vw,4.2rem)] font-black leading-[1.02] tracking-tight text-cocoa focus:outline-none"
        >
          We have your request.
        </h1>
        <p role="status" className="mx-auto mt-8 max-w-[44ch] font-sans text-[15px] leading-relaxed text-cocoa/70">
          {isTable
            ? 'Your request has been sent to Lumi Lane. The team will contact you to confirm your table.'
            : 'Your enquiry has been sent to Lumi Lane. The team will contact you to discuss your event.'}
        </p>
        <div className="relative mx-auto mt-12 max-w-md text-left sm:mt-14">
          <SlipPaper paperClassName={slipStyles.impact}>
            <dl>
              {rows.map(([k, v]) => (
                <SlipRow key={k} definition label={k} value={v} />
              ))}
            </dl>
          </SlipPaper>
          <InkStamp
            id="booking-stamp"
            word="Requested"
            seed={3}
            className={`${slipStyles.stamp} pointer-events-none absolute -right-3 top-12 w-[6.5rem] text-ember min-[400px]:top-14 sm:-right-12 sm:w-[8.5rem]`}
          />
        </div>
        <div className="mx-auto mt-12 flex max-w-xs flex-col gap-3 text-center sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
          <a href={BUSINESS.phone.href} className={buttonClass({ size: 'sm' })}>
            Call {BUSINESS.phone.display}
          </a>
          <button type="button" onClick={edit} className={buttonClass({ variant: 'outline', size: 'sm' })}>
            Edit details
          </button>
          <button type="button" onClick={reset} className={buttonClass({ variant: 'outline', size: 'sm' })}>
            Start over
          </button>
        </div>
        <p className="mx-auto mt-6 flex max-w-xs flex-col text-center sm:mt-10 sm:block sm:max-w-none">
          <ButtonLink href="/menu/" size="sm" variant="outline">
            See the menu
          </ButtonLink>
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow={BOOK.eyebrow} title={BOOK.title} titleWidth="max-w-[16ch]">
        <p className="mx-auto mt-6 max-w-[42ch] font-sans text-[15px] leading-relaxed text-cocoa/70">{BOOK.intro}</p>
        <p className="mx-auto mt-3 max-w-[44ch] font-sans text-[13px] leading-relaxed text-cocoa/60">{BOOK.subIntro}</p>
      </PageHeader>

      <form
        noValidate
        onSubmit={onSubmit}
        aria-label={isTable ? 'Table request' : `${requestType} enquiry`}
        className="mt-14 border-t border-cocoa/10 pt-12 sm:mt-16 sm:pt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-x-14 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-x-20"
      >
        <div className="grid gap-x-5 gap-y-7 sm:grid-cols-6 lg:col-start-1 lg:row-start-1">
          <fieldset className="min-w-0 sm:col-span-6" disabled={submitting}>
            <legend className="mb-3 text-sm font-semibold text-cocoa">What are you planning?</legend>
            <div className="flex flex-wrap gap-2">
              {REQUEST_TYPES.map((type) => (
                <label key={type} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="request-type"
                    value={type}
                    checked={type === requestType}
                    onChange={() => setRequestType(type)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex min-h-11 items-center rounded-full border border-cocoa/25 px-4 text-sm text-cocoa peer-checked:border-cocoa peer-checked:bg-cocoa peer-checked:text-shell peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember">
                    {type}
                  </span>
                </label>
              ))}
            </div>
            {!isTable && (
              <p className="mt-3 text-sm text-cocoa/75">
                {requestType === 'Catering'
                  ? 'Tell us about your occasion, food preferences and dietary requirements.'
                  : 'Tell us the occasion and what you need from the space.'}{' '}
                For more than 30 guests,{' '}
                <a href={BUSINESS.phone.href} className="underline">
                  call {BUSINESS.phone.display}
                </a>
                .
              </p>
            )}
          </fieldset>
          <BookingField
            id="book-name"
            label="Name"
            className="sm:col-span-6"
            value={values.name}
            error={errors.name}
            onChange={set('name')}
            placeholder="Full name"
            inputProps={{ type: 'text', autoComplete: 'name' }}
          />
          <BookingField
            id="book-email"
            label="Email"
            className="sm:col-span-3"
            value={values.email}
            error={errors.email}
            onChange={set('email')}
            placeholder="you@example.com"
            inputProps={{ type: 'email', autoComplete: 'email', inputMode: 'email' }}
          />
          <BookingField
            id="book-phone"
            label="Phone"
            className="sm:col-span-3"
            value={values.phone}
            error={errors.phone}
            onChange={set('phone')}
            placeholder="0400 000 000"
            inputProps={{ type: 'tel', autoComplete: 'tel', inputMode: 'tel' }}
          />
          <BookingField
            id="book-guests"
            label="Guests"
            className="sm:col-span-2"
            value={values.guests}
            error={errors.guests}
            onChange={set('guests')}
            placeholder="Number of guests"
            inputProps={{ type: 'text', inputMode: 'numeric' }}
          />
          <BookingField
            id="book-date"
            label="Date"
            className="sm:col-span-2"
            value={values.date}
            error={errors.date}
            onChange={set('date')}
            placeholder="DD/MM/YYYY"
            inputProps={{ type: 'text', inputMode: 'numeric', autoComplete: 'off' }}
          />
          <BookingField
            id="book-time"
            label="Time"
            className="sm:col-span-2"
            value={values.time}
            error={errors.time}
            onChange={set('time')}
            placeholder="e.g. 10:30 AM"
            inputProps={{ type: 'text', autoComplete: 'off' }}
          />
          <BookingField
            id="book-notes"
            label={isTable ? 'Special Requests' : 'Event details'}
            optional
            multiline
            className="sm:col-span-6"
            value={values.notes}
            onChange={set('notes')}
            error={errors.notes}
            placeholder={
              isTable
                ? 'Dietary requirements, allergies, high chair, accessibility, a birthday'
                : 'Occasion, location, dietary requirements and anything else we should know'
            }
          />
        </div>

        <ReservationSlip
          values={values}
          className="mx-auto mt-12 max-w-md lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:mt-0 lg:max-w-none"
        />

        <div className="mt-12 border-t border-cocoa/10 pt-8 lg:col-start-1 lg:row-start-2 lg:mt-10 lg:border-t-0 lg:pt-0">
          <button
            type="submit"
            disabled={submitting}
            className={buttonClass({ className: 'w-full py-5 text-[12px] tracking-[0.34em] sm:w-auto' })}
          >
            {submitting ? 'Sending…' : isTable ? BOOK.submitLabel : 'Send enquiry'}
          </button>
          {requestError && (
            <p role="alert" className="mt-5 max-w-[52ch] text-sm text-red-700">
              {requestError}
            </p>
          )}
          <p className="mt-5 max-w-[52ch] font-sans text-[12.5px] italic leading-relaxed text-cocoa/65">
            {isTable
              ? 'The team will contact you to confirm the reservation.'
              : 'The team will contact you to discuss your enquiry.'}{' '}
            For urgent requests, call us on{' '}
            <a
              href={BUSINESS.phone.href}
              className="not-italic text-cocoa/80 underline decoration-cocoa/25 underline-offset-4 transition-colors hover:text-ember"
            >
              {BUSINESS.phone.display}
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
