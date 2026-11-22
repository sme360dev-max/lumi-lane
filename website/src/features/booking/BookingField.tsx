import type { ChangeEvent, InputHTMLAttributes } from 'react';

const control =
  'mt-3 w-full appearance-none border-b bg-transparent pb-3 font-sans text-cocoa placeholder:text-cocoa/35 transition-colors duration-200 focus:border-ember focus:outline-none disabled:opacity-60';

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

/** Underlined text field from the original form, with an accessible label and error message. */
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
  const border = error ? 'border-ember' : 'border-cocoa/20';

  return (
    <div className={className}>
      <label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-[0.26em] text-cocoa/60">
        {label}
        {optional && <span className="tracking-normal text-cocoa/40"> (optional)</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={3} className={`${control} ${border} resize-none text-[16px] leading-relaxed`} />
      ) : (
        <input {...shared} {...inputProps} className={`${control} ${border} text-[17px]`} />
      )}
      {error && (
        <p id={errorId} className="mt-2 text-[11px] text-ember">
          {error}
        </p>
      )}
    </div>
  );
}
