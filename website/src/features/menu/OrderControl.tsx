'use client';

import { useState } from 'react';
import { formatAUD } from '@/features/cart/cartData';
import { useCart } from '@/features/cart/CartProvider';
import { QuantityControl } from '@/features/cart/QuantityControl';

export function OrderControl({ itemId, name, className = '' }: { itemId: string; name: string; className?: string }) {
  const { offers, quantities, change } = useCart();
  const [selectedKey, setSelectedKey] = useState('');
  const options = offers.get(itemId);
  if (!options?.length) return null;

  const hasVariants = Boolean(options[0]?.variant);
  const selected = hasVariants ? options.find(({ key }) => key === selectedKey) : options[0];
  const label = selected?.variant ? `${name}, ${selected.variant}` : name;

  return (
    <div className={`mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      {hasVariants && (
        <select
          aria-label={`Choose an option for ${name}`}
          value={selected?.key ?? ''}
          onChange={(event) => setSelectedKey(event.target.value)}
          className="h-9 max-w-full rounded-sm border border-cocoa/20 bg-shell pl-2 text-xs text-cocoa focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
        >
          <option value="" disabled>
            Choose an option
          </option>
          {options.map(({ key, variant, priceCents }) => (
            <option key={key} value={key}>
              {variant} · {formatAUD(priceCents)}
            </option>
          ))}
        </select>
      )}
      <QuantityControl
        label={label}
        quantity={selected ? (quantities[selected.key] ?? 0) : 0}
        disabled={!selected}
        onChange={(delta) => {
          if (selected) change(selected.key, delta);
        }}
      />
    </div>
  );
}
