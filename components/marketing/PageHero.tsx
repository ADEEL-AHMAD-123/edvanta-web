import { ReactNode } from 'react';

export function PageHero({
  eyebrow,
  title,
  description,
  size = 'md',
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  size?: 'md' | 'lg';
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-[0.07]"
        style={{ background: 'radial-gradient(50% 60% at 75% 0%, hsl(var(--primary)) 0%, transparent 70%)' }}
      />
      <div className={`mx-auto ${size === 'lg' ? 'max-w-3xl' : 'max-w-2xl'} px-5 ${size === 'lg' ? 'py-20 md:py-28' : 'py-16 md:py-20'} text-center`}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground">{eyebrow}</p>
        )}
        <h1 className={`mx-auto mt-4 font-bold tracking-tight text-foreground ${size === 'lg' ? 'text-4xl md:text-6xl' : 'text-4xl md:text-5xl'}`}>
          {title}
        </h1>
        {/* Gold accent underline — small, deliberate brand marker under every page's H1 */}
        <span aria-hidden className="mx-auto mt-5 block h-1 w-14 rounded-full bg-accent" />
        {description && (
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">{description}</p>
        )}
      </div>
    </section>
  );
}
