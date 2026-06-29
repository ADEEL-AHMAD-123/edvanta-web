import { MessageCircle, Wallet, Globe } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

const FEATURES = [
  { icon: MessageCircle, title: 'WhatsApp-native', desc: 'Reach every parent where they already are.' },
  { icon: Wallet, title: 'Local payments', desc: 'JazzCash, EasyPaisa & bank challans, built in.' },
  { icon: Globe, title: 'Urdu & offline', desc: 'A full Urdu experience on any connection.' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ── Brand panel (desktop) ───────────────────────────────── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex xl:p-14">
        {/* Dot-grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(hsl(var(--sidebar-foreground) / 0.06) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* Soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-primary opacity-20 blur-3xl"
        />

        <Logo size={40} className="relative" textClassName="text-xl" />

        {/* Headline + features */}
        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-[1.15] xl:text-[2.6rem]">
            Run your entire institution, beautifully.
          </h2>
          <p className="mt-4 text-sidebar-muted">
            From academies to universities — manage admissions, attendance, fees,
            results and parent communication in one platform.
          </p>

          <ul className="mt-9 space-y-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-active">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-sidebar-muted">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <figure className="relative rounded-2xl border border-sidebar-border bg-sidebar-accent p-5">
          <blockquote className="text-sm leading-relaxed">
            “We collected three months of pending fees in our first week — parents
            just pay from their phones now.”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-active text-xs font-semibold text-sidebar-active-foreground">
              FR
            </span>
            <div>
              <p className="text-sm font-medium">Farhan Rashid</p>
              <p className="text-xs text-sidebar-muted">Director, Iqra Academy · Lahore</p>
            </div>
          </figcaption>
        </figure>
      </aside>

      {/* ── Form panel ──────────────────────────────────────────── */}
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Compact logo for mobile */}
          <div className="mb-8 lg:hidden">
            <Logo size={38} />
          </div>

          {children}

          <p className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Edvanta · edvanta.pk
          </p>
        </div>
      </main>
    </div>
  );
}
