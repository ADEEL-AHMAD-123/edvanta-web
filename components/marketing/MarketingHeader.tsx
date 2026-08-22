import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/help', label: 'Help' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
] as const;

export function MarketingHeader({ active }: { active?: (typeof NAV_ITEMS)[number]['href'] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      {/* Thin gold rule at the very top — a small, deliberate brand touch on every page */}
      <div className="h-[3px] w-full bg-accent" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/"><Logo size={30} /></Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative py-1 transition-colors hover:text-foreground',
                active === item.href && 'text-foreground'
              )}
            >
              {item.label}
              {active === item.href && (
                <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-accent" />
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>Sign in</Link>
          <Link href="/register" className={buttonVariants({ size: 'sm' })}>Start free</Link>
        </div>
      </div>
    </header>
  );
}
