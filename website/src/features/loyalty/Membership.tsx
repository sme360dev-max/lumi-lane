'use client';

import JsBarcode from 'jsbarcode';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import styles from './Loyalty.module.css';

const SAMPLE_CODE = 'LUMI-PREVIEW';

export function Membership() {
  const [name, setName] = useState('');
  const [previewName, setPreviewName] = useState('');
  const barcode = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!previewName || !barcode.current) return;
    JsBarcode(barcode.current, SAMPLE_CODE, {
      format: 'CODE128',
      width: 2,
      height: 64,
      margin: 20,
      displayValue: false,
    });
  }, [previewName]);

  function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fullName = name.trim();
    if (fullName) setPreviewName(fullName);
  }

  return (
    <section id="join-club" tabIndex={-1} className={styles.membership} aria-labelledby="club-membership-title">
      <div>
        <h2 id="club-membership-title" className={styles.h2}>
          Preview your Coffee Club card
        </h2>
        <p className={styles.lede}>Enter a name to see how the card will look. This preview stays on this page.</p>
        <form className={styles.joinForm} onSubmit={preview}>
          <label htmlFor="club-name">Full name</label>
          <input
            id="club-name"
            name="name"
            maxLength={100}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button className={styles.primary} type="submit" disabled={!name.trim()}>
            Preview my card
          </button>
        </form>
        <p className={styles.memberNote}>
          Sample barcode for display only. A live membership and Apple Wallet pass require service activation.
        </p>
      </div>
      <div className={styles.realPhone}>
        <div className={styles.realScreen}>
          <div className={styles.island} aria-hidden="true" />
          <div className={styles.memberPass}>
            <p className={styles.passBrand}>Lumi Lane</p>
            <p className={styles.passTitle}>Coffee Club</p>
            <div className={styles.memberDetails} aria-live="polite">
              {previewName ? (
                <>
                  <p className={styles.memberName}>{previewName}</p>
                  <div className={styles.barcode}>
                    <svg ref={barcode} role="img" aria-label="Sample Coffee Club barcode" />
                    <span>{SAMPLE_CODE}</span>
                  </div>
                </>
              ) : (
                <p className={styles.passPlaceholder}>Your sample barcode appears here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
