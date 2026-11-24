import type { ReactNode } from 'react';
import { BUSINESS } from '@/data/business';
import { formatTime, parseDate, parseTime, type BookingValues } from './validation';
import styles from './Booking.module.css';

const NOT_CONFIRMED = 'Not yet confirmed — the team will contact you.';

interface SlipPaperProps {
  children: ReactNode;
  /** Extra classes for the paper itself (e.g. the impact animation). */
  paperClassName?: string;
  className?: string;
}

/** The printed paper: perforated top, venue wordmark, title, rows (children) and a torn-off stub. */
export function SlipPaper({ children, paperClassName = '', className = '' }: SlipPaperProps) {
  return (
    <div className={`${styles.lift} ${className}`}>
      <div className={`${styles.paper} ${paperClassName} px-6 pt-8 text-cocoa sm:px-8 sm:pt-9`}>
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-cocoa/15 pb-5">
          <div className="whitespace-nowrap">
            <p className="font-serif text-[15px] font-medium leading-none tracking-[0.32em] text-cocoa">LUMI LANE</p>
            <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.2em] text-cocoa/55">{BUSINESS.tagline}</p>
          </div>
          <p className="whitespace-nowrap pt-px font-sans text-[10.5px] leading-snug text-cocoa/55 min-[400px]:text-right">
            {BUSINESS.address.line1}
            <br />
            {BUSINESS.address.line2}
          </p>
        </div>

        <p className="mt-6 font-serif text-[1.45rem] font-bold leading-tight tracking-tight text-cocoa sm:text-[1.75rem]">
          Reservation request
        </p>

        <div className="mt-5 pb-7">{children}</div>

        <div className={`${styles.stub} flex flex-col justify-center border-t border-dashed border-cocoa/30`}>
          <p className="font-serif text-[14px] italic leading-snug text-cocoa/75">{NOT_CONFIRMED}</p>
          <p className="mt-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-cocoa/50">
            Enquiries {BUSINESS.phone.display}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SlipRowProps {
  label: string;
  value?: string;
  /** Shown in muted italic when there is no value yet. */
  placeholder?: string;
  /** Use dt/dd (inside a dl) instead of plain spans. */
  definition?: boolean;
}

/** One printed line: small-caps label, dot leader, value. */
export function SlipRow({ label, value, placeholder, definition }: SlipRowProps) {
  const Term = definition ? 'dt' : 'span';
  const Desc = definition ? 'dd' : 'span';
  return (
    <div className="flex flex-wrap items-start gap-x-2 py-[9px]">
      <Term className="shrink-0 pt-[5px] font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-cocoa/60">
        {label}
      </Term>
      <span aria-hidden="true" className={`${styles.leader} mt-[7px]`} />
      <Desc
        className={`ml-auto max-w-full text-right font-serif text-[16px] leading-snug [overflow-wrap:anywhere] ${
          value ? 'text-cocoa' : 'italic text-cocoa/40'
        }`}
      >
        {value || placeholder}
      </Desc>
    </div>
  );
}

const shortDate = (value: string) => {
  const d = parseDate(value);
  if (!d) return value.trim();
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const guestsLabel = (value: string) => {
  const v = value.trim();
  if (!/^\d+$/.test(v)) return v;
  return `${v} ${Number(v) === 1 ? 'guest' : 'guests'}`;
};

const timeLabel = (value: string) => {
  const t = parseTime(value);
  return t ? formatTime(t) : value.trim();
};

/**
 * Read-only preview of the request as it is typed. Purely visual: it never touches validation or
 * submission, and is not a live region (it would announce every keystroke).
 */
export function ReservationSlip({ values, className = '' }: { values: BookingValues; className?: string }) {
  return (
    <aside aria-label="Reservation slip preview" className={className}>
      <SlipPaper>
        <SlipRow label="Guests" value={guestsLabel(values.guests)} placeholder="— guests" />
        <SlipRow label="Date" value={shortDate(values.date)} placeholder="dd / mm / yyyy" />
        <SlipRow label="Time" value={timeLabel(values.time)} placeholder="— : —" />
        <SlipRow label="Name" value={values.name.trim()} placeholder="Your name" />
      </SlipPaper>
    </aside>
  );
}
