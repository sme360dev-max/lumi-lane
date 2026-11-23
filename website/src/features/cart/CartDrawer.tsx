'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import { ButtonLink, buttonClass } from '@/components/ui/Button';
import { formatAUD } from './cartData';
import { useCart } from './CartProvider';
import { QuantityControl } from './QuantityControl';
import styles from './CartDrawer.module.css';

const focus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember';

export function CartDrawer() {
  const { lines, count, subtotal, change, remove } = useCart();
  const pathname = usePathname();
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const unlock = useRef<(() => void) | null>(null);
  const itemCount = `${count} ${count === 1 ? 'item' : 'items'}`;

  const open = () => {
    const panel = dialog.current;
    if (!panel || panel.open) return;

    const root = document.documentElement;
    const { overflow, scrollbarGutter } = root.style;
    root.style.scrollbarGutter = 'stable';
    root.style.overflow = 'hidden';
    unlock.current = () => {
      root.style.overflow = overflow;
      root.style.scrollbarGutter = scrollbarGutter;
    };
    panel.showModal();
    closeButton.current?.focus({ preventScroll: true });
  };

  const close = () => dialog.current?.close();
  const restore = () => {
    unlock.current?.();
    unlock.current = null;
    trigger.current?.focus({ preventScroll: true });
  };

  useEffect(() => () => unlock.current?.(), []);

  const wrapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-label={`Shopping bag, ${itemCount}`}
        aria-haspopup="dialog"
        aria-controls="shopping-bag"
        className={`absolute left-4 top-4 inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full text-cocoa transition-colors hover:text-ember lg:left-8 ${focus}`}
        onClick={open}
      >
        <svg
          aria-hidden="true"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 8h14l1 13H4L5 8Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
        </svg>
        <span aria-hidden="true" className="text-xs tabular-nums">
          {count > 0 && count}
        </span>
      </button>

      <dialog
        ref={dialog}
        id="shopping-bag"
        aria-labelledby="shopping-bag-heading"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={restore}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={wrapFocus}
        className={`${styles.drawer} fixed inset-y-0 left-0 right-auto m-0 h-[100dvh] max-h-none w-[min(100%,28rem)] max-w-none overflow-hidden bg-shell text-left text-cocoa`}
      >
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-cocoa/15 px-6 pb-5 pt-7 sm:px-8">
            <div>
              <h2 id="shopping-bag-heading" className="font-serif text-3xl font-black tracking-tight">
                Shopping bag
              </h2>
              <p aria-live="polite" className="mt-2 text-sm text-cocoa/75">
                {itemCount}
              </p>
            </div>
            <button
              ref={closeButton}
              type="button"
              aria-label="Close shopping bag"
              onClick={close}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cocoa/25 text-lg transition-colors hover:bg-cocoa hover:text-shell ${focus}`}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8">
            {lines.length === 0 ? (
              <div className="py-10">
                <p className="font-serif text-xl">Your bag is empty.</p>
                <p className="mt-2 text-sm text-cocoa/75">Add something from the menu to start your order summary.</p>
              </div>
            ) : (
              <ul className="divide-y divide-cocoa/15">
                {lines.map((line) => {
                  const label = line.variant ? `${line.name}, ${line.variant}` : line.name;
                  const onRemove = () => closeButton.current?.focus({ preventScroll: true });
                  return (
                    <li key={line.key} className="py-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-serif text-lg font-medium leading-snug">{line.name}</h3>
                        <span className="shrink-0 text-sm font-medium tabular-nums">
                          <span className="sr-only">Item total </span>
                          {formatAUD(line.priceCents * line.quantity)}
                        </span>
                      </div>
                      {line.variant && <p className="mt-1 text-sm text-cocoa/75">{line.variant}</p>}
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3">
                        <QuantityControl
                          label={label}
                          quantity={line.quantity}
                          onChange={(delta) => change(line.key, delta)}
                          onEmpty={onRemove}
                        />
                        <button
                          type="button"
                          aria-label={`Remove ${label}`}
                          className={`min-h-9 rounded-sm px-1 text-xs underline underline-offset-4 transition-colors hover:text-ember ${focus}`}
                          onClick={() => {
                            onRemove();
                            remove(line.key);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="shrink-0 space-y-4 border-t border-cocoa/15 px-6 pb-6 pt-5 sm:px-8">
            {lines.length > 0 && (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-serif text-lg font-medium">Subtotal</span>
                  <output aria-label="Subtotal in Australian dollars" className="font-semibold tabular-nums">
                    {formatAUD(subtotal)} AUD
                  </output>
                </div>
                <p className="text-sm leading-relaxed text-cocoa/75">
                  This is an order summary. Online ordering and payment are unavailable.
                </p>
              </>
            )}
            {pathname === '/menu/' || pathname === '/menu' ? (
              <button type="button" className={buttonClass({ variant: 'outline', size: 'sm' })} onClick={close}>
                Continue Shopping
              </button>
            ) : (
              <ButtonLink href="/menu/" variant="outline" size="sm" onClick={close}>
                Continue Shopping
              </ButtonLink>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
