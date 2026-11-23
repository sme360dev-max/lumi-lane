'use client';

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { MenuCategory } from '@/types/menu';
import { cartLines, cartTotals, changeQuantity, menuOffers, readQuantities, removeQuantity } from './cartData';
import type { CartLine, CartQuantities, Offer } from './cartData';

const STORAGE_KEY = 'lumi-lane-cart-v1';
const EMPTY: CartQuantities = {};

function createCartStore() {
  let quantities: CartQuantities | undefined;
  const listeners = new Set<() => void>();
  const getSnapshot = () => {
    if (quantities) return quantities;
    try {
      quantities = readQuantities(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      quantities = EMPTY;
    }
    return quantities;
  };

  return {
    getSnapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    update(transform: (current: CartQuantities) => CartQuantities) {
      const current = getSnapshot();
      const next = transform(current);
      if (next === current) return;
      quantities = next;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // The cart still works in memory when browser storage is unavailable.
      }
      listeners.forEach((listener) => listener());
    },
  };
}

interface CartContextValue {
  menu: MenuCategory[];
  replaceMenu: (menu: MenuCategory[]) => void;
  offers: Map<string, Offer[]>;
  quantities: CartQuantities;
  lines: CartLine[];
  count: number;
  subtotal: number;
  change: (key: string, delta: -1 | 1) => void;
  remove: (key: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ initialMenu, children }: { initialMenu: MenuCategory[]; children: ReactNode }) {
  const [catalog, setCatalog] = useState(() => ({ menu: initialMenu, offers: menuOffers(initialMenu) }));
  const [store] = useState(createCartStore);
  const quantities = useSyncExternalStore(store.subscribe, store.getSnapshot, () => EMPTY);
  const lines = useMemo(() => cartLines(catalog.offers, quantities), [catalog.offers, quantities]);
  const totals = useMemo(() => cartTotals(lines), [lines]);

  const replaceMenu = useCallback(
    (menu: MenuCategory[]) => {
      const offers = menuOffers(menu);
      setCatalog({ menu, offers });
      store.update((current) => {
        const valid = cartLines(offers, current);
        if (valid.length === Object.keys(current).length) return current;
        return Object.fromEntries(valid.map(({ key, quantity }) => [key, quantity]));
      });
    },
    [store],
  );

  const change = (key: string, delta: -1 | 1) => store.update((current) => changeQuantity(current, key, delta));
  const remove = (key: string) => store.update((current) => removeQuantity(current, key));

  return (
    <CartContext.Provider value={{ ...catalog, quantities, lines, ...totals, replaceMenu, change, remove }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error('Cart controls require a CartProvider.');
  return cart;
}
