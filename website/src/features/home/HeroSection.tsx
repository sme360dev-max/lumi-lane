'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { HERO } from '@/data/content';
import { NARROW, WIDE, createPoser, ringPosition } from './heroOrbit';

const REST = 1.6; // seconds the hero dish holds the centre
const MOVE = 0.7; // seconds of dish travel per swap
const TEXT = 0.42; // headline cross duration
const LEAD = 0.11; // headline starts this far ahead of the dishes

const DISH_SIZES =
  '(min-width: 1024px) min(calc(112.4vh - 326px), 78vw), (min-width: 640px) min(82vh, 92vw), min(58vh, 122vw)';

function setLines(el: HTMLElement, lines: readonly [string, string]) {
  el.replaceChildren(
    document.createTextNode(lines[0]),
    document.createElement('br'),
    document.createTextNode(lines[1]),
  );
}

export function HeroSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerA = useRef<HTMLSpanElement>(null);
  const layerB = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const a = layerA.current;
    const b = layerB.current;
    if (!stage || !a || !b) return;
    const layers = [a, b];
    const dishes = Array.from(stage.querySelectorAll<HTMLImageElement>('.hero-dish'));
    const n = dishes.length;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ring = { pos: 0 };
    let live = 0;
    let width = 0;
    let height = 0;
    let pose = createPoser(WIDE);
    let tl: gsap.core.Timeline | null = null;
    let timer: number | undefined;
    let resizeTimer: number | undefined;

    const measure = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      pose = createPoser(window.innerWidth < 640 ? NARROW : WIDE);
    };
    const render = () => {
      dishes.forEach((el, k) => {
        const s = pose(ringPosition(k, ring.pos, n), width, height);
        el.style.transform = `translate3d(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px,0) rotate(${s.rotate.toFixed(2)}deg) scale(${s.scale.toFixed(4)})`;
        el.style.opacity = s.opacity.toFixed(3);
        el.style.zIndex = String(s.zIndex);
      });
    };
    const paint = () => {
      measure();
      render();
    };
    const activeIndex = () => ((Math.round(ring.pos) % n) + n) % n;

    const goTo = (target: number) => {
      window.clearTimeout(timer);
      tl?.kill();
      measure();
      // Always rotate forward to the nearest matching position, so the orbit never reverses.
      const from = Math.round(ring.pos);
      const steps = (((target - from) % n) + n) % n;
      const to = from + (steps || n);

      const out = layers[live]!;
      const into = layers[1 - live]!;
      setLines(into, HERO.dishes[target]!.lines);
      into.removeAttribute('aria-hidden');
      out.setAttribute('aria-hidden', 'true');
      live = 1 - live;

      tl = gsap.timeline({ onComplete: schedule });
      gsap.set(into, { yPercent: 30, opacity: 0 });
      tl.to(out, { yPercent: -28, opacity: 0, duration: TEXT * 0.8, ease: 'power2.in' }, 0)
        .to(into, { yPercent: 0, opacity: 1, duration: TEXT, ease: 'power3.out' }, TEXT * 0.34)
        .to(ring, { pos: to, duration: MOVE, ease: 'power2.inOut', onUpdate: render }, LEAD);
    };
    function schedule() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => goTo((activeIndex() + 1) % n), REST * 1000);
    }

    // Keep the composition proportional without interrupting a running swap.
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!tl?.isActive()) paint();
      }, 150);
    };
    window.addEventListener('resize', onResize);

    gsap.set(b, { opacity: 0 });
    paint();
    // Reduced motion: the composition stays still on the first dish (no orbit, no text swaps).
    if (!reduce) schedule();

    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(timer);
      window.clearTimeout(resizeTimer);
      tl?.kill();
      gsap.killTweensOf([ring, a, b]);
    };
  }, []);

  const first = HERO.dishes[0];

  return (
    <section
      aria-labelledby="hero-headline"
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-32 pt-20 text-center sm:px-6 sm:pt-24"
    >
      <p className="font-script text-3xl text-ember sm:text-4xl">{HERO.eyebrow}</p>

      <h1
        id="hero-headline"
        className="mx-auto mt-4 grid max-w-[26ch] font-serif text-[clamp(1.5rem,7.6vw,6.4rem)] font-black leading-[0.93] tracking-tight text-cocoa"
      >
        <span className="sr-only">Lumi Lane, coffee house and bar in Lightsview, Adelaide. </span>
        <span ref={layerA} className="hero-line">
          {first.lines[0]}
          <br />
          {first.lines[1]}
        </span>
        <span ref={layerB} className="hero-line" aria-hidden="true" />
      </h1>

      <div ref={stageRef} className="hero-stage pointer-events-none">
        {HERO.dishes.map((d, i) => (
          <ResponsivePicture
            key={d.image}
            name={d.image}
            widths={[480, 800, 1254]}
            sizes={DISH_SIZES}
            width={1254}
            height={1254}
            alt={d.alt}
            className="hero-dish"
            priority={i < 2}
            fetchPriority={i === 0 ? 'high' : i < 2 ? 'auto' : 'low'}
          />
        ))}
      </div>
    </section>
  );
}
