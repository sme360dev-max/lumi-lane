'use client';

import JsBarcode from 'jsbarcode';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import styles from './Loyalty.module.css';

const STORAGE_KEY = 'lumi-lane-coffee-club-device-card';
type DeviceCard = { name: string; code: string; email?: string; phone?: string };

const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validPhone = (value: string) => /^\+?[\d ()-]+$/.test(value) && /^\d{8,15}$/.test(value.replace(/\D/g, ''));

export function Membership() {
  const [name, setName] = useState('');
  const [card, setCard] = useState<DeviceCard | null>(null);
  const registered = !!(card?.name.trim() && validEmail(card.email ?? '') && validPhone(card.phone ?? ''));
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const barcode = useRef<SVGSVGElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const pass = useRef<HTMLDivElement>(null);
  const motion = useRef<Animation | null>(null);

  function reveal() {
    motion.current?.cancel();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    motion.current =
      pass.current?.animate(
        [
          { transform: 'translateY(145cqi) scale(.9)', opacity: 0, offset: 0 },
          { opacity: 1, offset: 0.24 },
          { transform: 'translateY(-4%) scale(1.025)', offset: 0.74 },
          { transform: 'translateY(0) scale(1)', offset: 1 },
        ],
        { duration: 900, easing: 'cubic-bezier(.22,.75,.24,1)' },
      ) ?? null;
  }

  useEffect(() => {
    const target = screen.current;
    if (!target || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        reveal();
      },
      { threshold: 0.35 },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
      motion.current?.cancel();
    };
  }, []);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
        if (typeof saved?.name === 'string' && typeof saved.code === 'string' && /^LL[0-9A-F]{10}$/.test(saved.code)) {
          setName(saved.name);
          setCard({
            name: saved.name,
            code: saved.code,
            email: typeof saved.email === 'string' ? saved.email : undefined,
            phone: typeof saved.phone === 'string' ? saved.phone : undefined,
          });
        }
      } catch {
        // An invalid or inaccessible card can be replaced.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!card || !barcode.current) return;
    JsBarcode(barcode.current, card.code, {
      format: 'CODE128',
      width: 2,
      height: 60,
      margin: 18,
      displayValue: false,
    });
  }, [card]);

  function signUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || registered || !name.trim()) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const email = String(fields.get('email') ?? '').trim();
    const phone = String(fields.get('phone') ?? '').trim();
    if (!validEmail(email) || !validPhone(phone)) {
      const field = form.elements.namedItem(!validEmail(email) ? 'email' : 'phone') as HTMLInputElement;
      field.setCustomValidity(
        !validEmail(email) ? 'Enter a valid email address.' : 'Enter a phone number with 8 to 15 digits.',
      );
      field.reportValidity();
      return;
    }
    try {
      const code = card?.code ?? 'LL' + crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase();
      const nextCard = { name: name.trim(), email, phone, code };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCard));
      setCard(nextCard);
      reveal();
    } catch {
      setError('Your browser could not save the card. Allow browser storage and try again.');
    }
  }

  return (
    <section id="join-club" tabIndex={-1} className={styles.membership} aria-labelledby="club-membership-title">
      <div>
        <h2 id="club-membership-title" className={styles.h2}>
          {registered ? 'Your Coffee Club card' : card ? 'Complete your membership' : 'Sign up for Coffee Club'}
        </h2>
        <p className={styles.lede}>
          {registered
            ? 'Your card is saved on this device. Return to this page to open it.'
            : 'Enter your contact details to save your membership on this device.'}
        </p>
        {!registered && (
          <form className={styles.joinForm} onSubmit={signUp}>
            <label htmlFor="club-name">Full name</label>
            <input
              id="club-name"
              name="name"
              autoComplete="name"
              maxLength={100}
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
            />
            <label htmlFor="club-email">Email address</label>
            <input
              id="club-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              onInput={(event) => event.currentTarget.setCustomValidity('')}
            />
            <label htmlFor="club-phone">Phone number</label>
            <input
              id="club-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={32}
              onInput={(event) => event.currentTarget.setCustomValidity('')}
            />
            <button className={styles.primary} type="submit" disabled={!ready || !name.trim()}>
              {card ? 'Save details' : 'Create my card'}
            </button>
            {error && <p role="alert">{error}</p>}
          </form>
        )}
        {registered && (
          <button type="button" disabled aria-describedby="wallet-availability" className={styles.walletButton}>
            Add to Apple Wallet
          </button>
        )}
        <p id="wallet-availability" className={styles.memberNote}>
          Device-only card. Apple Wallet and in-store membership are currently unavailable.
        </p>
      </div>
      <div className={styles.realPhone}>
        <div ref={screen} className={styles.realScreen}>
          <div className={styles.walletHeading} aria-hidden="true" />
          <div ref={pass} className={styles.memberPass} aria-live="polite">
            <div className={styles.passFace}>
              <p className={styles.passBrand}>Lumi Lane</p>
              <p className={styles.passLabel}>Member card</p>
            </div>
            {card && (
              <div className={styles.memberDetails}>
                <p className={styles.memberName}>{card.name}</p>
                <div className={styles.barcode}>
                  <svg ref={barcode} role="img" aria-label="Device card barcode" />
                  <span>{card.code}</span>
                </div>
              </div>
            )}
          </div>
          <div className={styles.walletStack} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
