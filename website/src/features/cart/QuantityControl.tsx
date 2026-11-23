'use client';

import { useRef } from 'react';

const control =
  'grid h-9 min-w-9 shrink-0 place-items-center rounded-full text-cocoa transition-colors hover:bg-cocoa/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:text-cocoa/50';

export function QuantityControl({
  label,
  quantity,
  onChange,
  onEmpty,
  disabled = false,
}: {
  label: string;
  quantity: number;
  onChange: (delta: -1 | 1) => void;
  onEmpty?: () => void;
  disabled?: boolean;
}) {
  const increase = useRef<HTMLButtonElement>(null);

  return (
    <div className="inline-flex min-h-9 shrink-0 items-center gap-0.5 text-sm tabular-nums">
      {quantity > 0 && (
        <>
          <button
            type="button"
            className={control}
            aria-label={`Decrease quantity of ${label}`}
            onClick={() => {
              if (quantity === 1) {
                if (onEmpty) onEmpty();
                else increase.current?.focus({ preventScroll: true });
              }
              onChange(-1);
            }}
          >
            −
          </button>
          <output aria-label={`${label} quantity`} className="min-w-4 text-center">
            {quantity}
          </output>
        </>
      )}
      <button
        ref={increase}
        type="button"
        className={`${control} ${quantity === 0 ? 'border border-cocoa/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em]' : ''}`}
        disabled={disabled}
        aria-label={quantity > 0 ? `Increase quantity of ${label}` : `Add ${label}`}
        onClick={() => onChange(1)}
      >
        {quantity > 0 ? '+' : 'Add'}
      </button>
    </div>
  );
}
