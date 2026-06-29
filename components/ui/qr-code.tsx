'use client';

import { useEffect, useRef } from 'react';

/**
 * Renders a QR code without an npm dependency by lazy-loading the small
 * `qrcodejs` UMD bundle from cdnjs the first time a QR is needed. Falls back to
 * showing the raw value if the library can't be reached (e.g. offline).
 */
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';

let loader: Promise<void> | null = null;
function loadQrLib(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject();
  if ((window as any).QRCode) return Promise.resolve();
  if (loader) return loader;
  loader = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = CDN;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
  return loader;
}

export function QRCode({ value, size = 96 }: { value: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadQrLib()
      .then(() => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = '';
        // eslint-disable-next-line new-cap
        new (window as any).QRCode(ref.current, {
          text: value,
          width: size,
          height: size,
          correctLevel: (window as any).QRCode.CorrectLevel?.M ?? 0,
        });
      })
      .catch(() => {
        if (!cancelled && ref.current) {
          ref.current.textContent = value;
        }
      });
    return () => { cancelled = true; };
  }, [value, size]);

  return <div ref={ref} style={{ width: size, height: size }} className="shrink-0 [&>img]:block [&>canvas]:block" aria-label="QR code" />;
}
