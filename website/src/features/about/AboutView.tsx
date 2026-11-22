import { ButtonLink } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { ABOUT } from '@/data/content';

export function AboutView() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow={ABOUT.eyebrow} title={ABOUT.title} titleWidth="max-w-[18ch]" />

      <div className="mt-16 grid gap-x-16 gap-y-10 border-t border-cocoa/10 pt-12 md:grid-cols-2">
        {ABOUT.columns.map((paras, i) => (
          <div key={i} className="space-y-6 text-[15px] leading-[1.75] text-cocoa/70">
            {paras.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ))}
      </div>

      <figure className="mt-20 border-y border-cocoa/10 py-14 text-center">
        <blockquote className="mx-auto max-w-[26ch] font-serif text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium italic leading-[1.25] text-cocoa">
          {ABOUT.quote}
        </blockquote>
      </figure>

      <dl className="mt-20 grid gap-x-12 gap-y-12 text-center sm:grid-cols-3">
        {ABOUT.facts.map((f) => (
          <div key={f.term}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ember">{f.term}</dt>
            <dd className="mt-4 font-serif text-2xl text-cocoa">{f.title}</dd>
            <dd className="mt-2 text-[13px] leading-relaxed text-cocoa/60">{f.text}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-20 text-center">
        <ButtonLink href="/menu/">{ABOUT.ctaLabel}</ButtonLink>
      </div>
    </div>
  );
}
