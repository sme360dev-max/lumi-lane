import type { AcaiItem, MenuItem, StandardItem, WineItem } from '@/types/menu';

/** Empty thumbnail slot: the original menu has no item photos (brand monogram via CSS). */
const Thumb = () => <div className="menu-thumb self-start" aria-hidden="true" />;

/** "-" in a wine column means "not offered that way". */
const Cell = ({ value, label }: { value: string; label: string }) =>
  value === '-' ? (
    <span className="text-cocoa/25">
      <span aria-hidden="true">-</span>
      <span className="sr-only">{label} not available</span>
    </span>
  ) : (
    <>
      <span className="sr-only">{label} </span>
      {value}
    </>
  );

function Standard({ item }: { item: StandardItem }) {
  return (
    <li className="menu-item flex items-start gap-4 border-t border-cocoa/10 py-4 sm:gap-5" data-item-id={item.id}>
      <Thumb />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h4 className="font-serif text-[17px] font-medium leading-snug text-cocoa">{item.name}</h4>
          <span aria-hidden="true" className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-cocoa/25" />
          <span className="shrink-0 text-sm font-medium tabular-nums text-cocoa/85" data-price>
            {item.price}
          </span>
        </div>
        {item.description && (
          <p className="mt-1.5 max-w-[54ch] text-[13px] leading-relaxed text-cocoa/60">{item.description}</p>
        )}
      </div>
    </li>
  );
}

function Acai({ item }: { item: AcaiItem }) {
  return (
    <li className="menu-item flex items-start gap-4 border-t border-cocoa/10 py-5 sm:gap-5" data-item-id={item.id}>
      <Thumb />
      <div className="min-w-0 flex-1">
        <h4 className="font-serif text-[19px] font-medium text-cocoa">{item.name}</h4>
        <p className="mt-1.5 max-w-[46ch] text-[13px] leading-relaxed text-cocoa/60">{item.description}</p>
      </div>
    </li>
  );
}

function Wine({ item }: { item: WineItem }) {
  return (
    <li
      className="grid grid-cols-[auto_1fr_auto_auto] items-baseline gap-x-3 border-t border-cocoa/10 py-4 sm:gap-x-5"
      data-item-id={item.id}
    >
      <Thumb />
      <div className="min-w-0">
        <h4 className="font-serif text-[17px] font-medium leading-snug text-cocoa">{item.name}</h4>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cocoa/45">{item.region}</p>
      </div>
      <span className="w-12 text-right text-sm tabular-nums text-cocoa/85" data-price>
        <Cell value={item.glass} label="Glass" />
      </span>
      <span className="w-14 text-right text-sm tabular-nums text-cocoa/85" data-price>
        <Cell value={item.bottle} label="Bottle" />
      </span>
    </li>
  );
}

export function MenuItemRow({ item }: { item: MenuItem }) {
  switch (item.kind) {
    case 'std':
      return <Standard item={item} />;
    case 'acai':
      return <Acai item={item} />;
    case 'wine':
      return <Wine item={item} />;
  }
}
