import type { ChangeEvent, InputHTMLAttributes } from 'react';

// Bordered box on slightly lighter paper. State changes are instant (no colour animation).
const control =
  'mt-2 block min-h-[48px] w-full appearance-none rounded-[5px] border bg-[#fffaf2] px-4 font-sans text-[16px] text-cocoa placeholder:text-cocoa/40 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember disabled:opacity-60';

interface FieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  optional?: boolean;
  multiline?: boolean;
  className?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  placeholder?: string;
}

/** Bordered text field with a visible label above and an error message tied to it by aria-describedby. */
export function BookingField({
  id,
  label,
  value,
  error,
  onChange,
  optional,
  multiline,
  className = '',
  inputProps,
  placeholder,
}: FieldProps) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    name: id.replace('book-', ''),
    value,
    placeholder,
    required: !optional,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };
  const border = error ? 'border-ember' : 'border-cocoa/40 hover:border-cocoa/60';

  return (
    <div className={className}>
      <label htmlFor={id} className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-cocoa/70">
        {label}
        {optional && <span className="font-normal normal-case tracking-normal text-cocoa/50"> (optional)</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={4} className={`${control} ${border} min-h-[7.5rem] resize-y py-3 leading-relaxed`} />
      ) : (
        <input {...shared} {...inputProps} className={`${control} ${border} py-3`} />
      )}
      {error && (
        <p id={errorId} className="mt-2 flex items-start gap-2 font-sans text-[13px] leading-snug text-[#a3402f]">
          <span aria-hidden="true" className="mt-[0.42em] h-[5px] w-[5px] shrink-0 rotate-45 bg-ember" />
          {error}
        </p>
      )}
    </div>
  );
}
