import { cn } from '@/lib/utils';

const GOLD = '#C9A24A';

/**
 * Marksly brand mark — an "M" monogram in a rounded frame with a gold
 * "foundation" line. Kept as inline SVG so it's easy to tweak later.
 * (Rebranded from the earlier Edvanta "E" monogram — same frame/line
 * treatment, letterform swapped to M via a stroked polyline rather than
 * rects, since M's diagonals don't reduce to axis-aligned bars the way E did.)
 *
 * `plain` (default): frame + M use currentColor so the mark adapts to any
 * surface (ink on light, white on the navy sidebar); the base line stays
 * academic gold. `tile`: filled navy app-icon version for favicons/avatars.
 *
 * Standalone files live in /public (logo-mark.svg, logo-full.svg,
 * logo-full-white.svg) and /app/icon.svg — keep them in sync if you edit this.
 */
export function LogoMark({
  size = 36,
  className,
  variant = 'plain',
}: {
  size?: number;
  className?: string;
  variant?: 'tile' | 'plain';
}) {
  if (variant === 'tile') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        fill="none"
        role="img"
        aria-label="Marksly"
        className={className}
      >
        <defs>
          <linearGradient id="mksTile" x1="14" y1="8" x2="84" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#243264" />
            <stop offset="1" stopColor="#141C38" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="88" height="88" rx="26" fill="url(#mksTile)" />
        {/* M: two stems + a center dip, stroked as one continuous line */}
        <polyline
          points="28,64 28,30 48,48 68,30 68,64"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="9.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="34" y="70" width="28" height="5" rx="2.5" fill={GOLD} />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      role="img"
      aria-label="Marksly"
      className={className}
    >
      <rect x="2.25" y="2.25" width="51.5" height="51.5" rx="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
      {/* M: two stems + a center dip, stroked as one continuous line */}
      <polyline
        points="14,41 14,16 28,30 42,16 42,41"
        fill="none"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="19" y="44" width="18" height="3.4" rx="1.7" fill={GOLD} />
    </svg>
  );
}

/** Full horizontal lockup: mark + wordmark. Wordmark uses currentColor. */
export function Logo({
  size = 34,
  className,
  textClassName,
  variant = 'plain',
}: {
  size?: number;
  className?: string;
  textClassName?: string;
  variant?: 'tile' | 'plain';
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} variant={variant} />
      <span className={cn('text-lg font-bold tracking-tight', textClassName)}>
        Marksly
      </span>
    </span>
  );
}
