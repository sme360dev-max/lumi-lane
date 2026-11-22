import type { MenuColumn as Column } from '@/types/menu';
import { MenuItemRow } from './MenuItems';

const heading = 'text-[11px] font-semibold uppercase tracking-[0.3em] text-cocoa';

/** Layout per column type; the API sends content only. */
const LAYOUT: Record<Column['kind'], string | undefined> = {
  list: undefined,
  notice: 'md:col-span-2',
  pricing: 'md:pt-1',
};

export function MenuColumn({ column: data }: { column: Column }) {
  const column = { ...data, className: data.className ?? LAYOUT[data.kind] } as Column;
  if (column.kind === 'notice') {
    return (
      <div className={column.className}>
        <div className="border-t border-cocoa/10 pt-8">
          <h3 className={heading}>{column.title}</h3>
          <p className="mt-3 text-[13px] text-cocoa/60">{column.text}</p>
        </div>
      </div>
    );
  }

  if (column.kind === 'pricing') {
    return (
      <div className={column.className}>
        <div className="border border-cocoa/15 px-8 py-10">
          {column.groups.map((g, i) => (
            <div key={g.title}>
              <h3 className={`${i ? 'mt-10 ' : ''}${heading}`}>{g.title}</h3>
              <ul className="mt-5 space-y-2 text-sm text-cocoa/75">
                {g.rows.map((r) => (
                  <li key={r.label} className="flex items-baseline justify-between gap-4">
                    <span>{r.label}</span>
                    <span className="tabular-nums" data-price>
                      {r.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-10 text-[12px] italic leading-relaxed text-cocoa/50">{column.note}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={column.className}>
      <h3 className={heading}>{column.title}</h3>
      {column.note && <p className="mt-2 text-[12px] italic text-cocoa/55">{column.note}</p>}
      {column.wine && (
        <div
          aria-hidden="true"
          className="mt-6 grid grid-cols-[1fr_auto_auto] gap-x-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-cocoa/40 sm:gap-x-5"
        >
          <span />
          <span className="w-12 text-right">Gls</span>
          <span className="w-14 text-right">Btl</span>
        </div>
      )}
      <ul className={column.wine ? undefined : 'mt-6'}>
        {column.items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
