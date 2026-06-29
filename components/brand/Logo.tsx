import { cn } from '@/lib/utils';

const GOLD = '#C9A24A';

/**
 * Edvanta brand mark — an "E" monogram in a rounded frame with a gold
 * "foundation" line. Kept as inline SVG so it's easy to tweak later.
 *
 * `plain` (default): frame + E use currentColor so the mark adapts to any
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
        aria-label="Edvanta"
        className={className}
      >
        <defs>
          <linearGradient id="edvTile" x1="14" y1="8" x2="84" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#243264" />
            <stop offset="1" stopColor="#141C38" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="88" height="88" rx="26" fill="url(#edvTile)" />
        {/* E: stem + three bars */}
        <rect x="28" y="30" width="9.5" height="34" rx="4.75" fill="#FFFFFF" />
        <rect x="28" y="30" width="40" height="8.5" rx="4.25" fill="#FFFFFF" />
        <rect x="28" y="42.75" width="30" height="8.5" rx="4.25" fill="#FFFFFF" />
        <rect x="28" y="55.5" width="40" height="8.5" rx="4.25" fill="#FFFFFF" />
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
      aria-label="Edvanta"
      className={className}
    >
      <rect x="2.25" y="2.25" width="51.5" height="51.5" rx="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
      {/* E: stem + three bars */}
      <rect x="14" y="16" width="6.5" height="25" rx="3.25" fill="currentColor" />
      <rect x="14" y="16" width="28" height="6.5" rx="3.25" fill="currentColor" />
      <rect x="14" y="25.25" width="21" height="6.5" rx="3.25" fill="currentColor" />
      <rect x="14" y="34.5" width="28" height="6.5" rx="3.25" fill="currentColor" />
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
        Edvanta
      </span>
    </span>
  );
}
