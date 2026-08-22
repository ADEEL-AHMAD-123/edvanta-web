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
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary opacity-10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-accent opacity-10 blur-3xl" />
      <div className={`mx-auto ${size === 'lg' ? 'max-w-3xl' : 'max-w-2xl'} px-5 ${size === 'lg' ? 'py-20 md:py-28' : 'py-16 md:py-20'} text-center`}>
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {eyebrow}
          </span>
        )}
        <h1 className={`mx-auto mt-5 font-bold tracking-tight text-foreground ${size === 'lg' ? 'text-4xl md:text-6xl' : 'text-4xl md:text-5xl'}`}>
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
