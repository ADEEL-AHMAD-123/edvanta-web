import type { Metadata } from 'next';
import Link from 'next/link';
import {
  GraduationCap, Users, CalendarCheck, Wallet, FileText, CalendarClock,
  CreditCard, MessageSquare, BarChart2, ShieldCheck, Check, ArrowRight, Globe,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { buttonVariants } from '@/components/ui/button-variants';

export const metadata: Metadata = {
  title: 'Edvanta — School & Campus Management Software',
  description:
    'Edvanta is an all-in-one management system for academies, schools, colleges and universities in Pakistan — students, attendance, fees, exams, timetable, ID cards and parent messaging in one place.',
};

const FEATURES = [
  { icon: GraduationCap, title: 'Student records', desc: 'Admissions, profiles, classes and sections — with bulk CSV import and auto-linked parents.' },
  { icon: CalendarCheck, title: 'Attendance', desc: 'Teachers mark their own classes in seconds; admins get instant institution-wide rates.' },
  { icon: Wallet, title: 'Fees & invoices', desc: 'Fee structures, monthly auto-billing, discounts and fines, receipts and dues tracking.' },
  { icon: FileText, title: 'Exams & results', desc: 'Create exams, enter marks on a fast grid, and publish results to students and parents.' },
  { icon: CalendarClock, title: 'Timetable', desc: 'Build weekly schedules per section; teachers see “teaching now” with one-tap attendance.' },
  { icon: CreditCard, title: 'ID cards', desc: 'Generate and print student ID cards with a scannable QR code, class by class.' },
  { icon: MessageSquare, title: 'Parent messaging', desc: 'Send SMS and WhatsApp to parents and staff, with a full delivery log.' },
  { icon: BarChart2, title: 'Reports', desc: 'Live dashboards across attendance, fees and results — know your numbers at a glance.' },
];

const PAKISTAN = [
  { icon: Wallet, title: 'Local payments', desc: 'JazzCash, EasyPaisa, bank transfer and challans — the methods your families already use.' },
  { icon: MessageSquare, title: 'WhatsApp & SMS', desc: 'Reach every parent where they already are, in Urdu or English.' },
  { icon: Globe, title: 'Urdu & English', desc: 'A familiar experience for staff and parents, on any connection.' },
  { icon: ShieldCheck, title: 'Secure & multi-tenant', desc: 'Each institution’s data is isolated and protected, with role-based access throughout.' },
];

const PLANS = [
  {
    name: 'Starter', price: 'Free', note: 'For small academies getting started',
    features: ['Up to 50 students', 'Students, attendance & classes', 'Fees & invoices', 'Exams & results', 'Email support'],
    cta: 'Start free', highlight: false,
  },
  {
    name: 'Growth', price: 'Rs 2,500', note: 'per month · 14-day free trial',
    features: ['Up to 300 students', 'Everything in Starter', 'Timetable & ID cards', 'SMS & WhatsApp messaging', 'Reports & analytics', 'Priority support'],
    cta: 'Start free trial', highlight: true,
  },
  {
    name: 'Institution', price: 'Custom', note: 'Colleges & universities',
    features: ['Unlimited students', 'Everything in Growth', 'Multiple campuses', 'Custom onboarding', 'Dedicated support'],
    cta: 'Contact us', highlight: false,
  },
];

const FAQ = [
  { q: 'Is Edvanta only for schools?', a: 'No — it works for academies, schools, colleges and universities. The modules and terminology adapt to your institution.' },
  { q: 'How are fees handled?', a: 'You manage fee collection your way — generate invoices and record payments (cash, bank, JazzCash, EasyPaisa). Online collection can be enabled too.' },
  { q: 'Do you support WhatsApp and SMS?', a: 'Yes. Connect your provider keys and send announcements and alerts to parents and staff, with a delivery log.' },
  { q: 'Is my data safe?', a: 'Every institution is fully isolated in a multi-tenant architecture with role-based access and encrypted sessions.' },
  { q: 'How do I get started?', a: 'Click “Start free trial”, create your institution in a couple of minutes, and you’re in — no card required to begin.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo size={30} />
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pakistan" className="hover:text-foreground">Why Edvanta</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>Sign in</Link>
            <Link href="/register" className={buttonVariants({ size: 'sm' })}>Start free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary opacity-10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-5 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Built for institutions in Pakistan
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Run your entire institution in one place
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Edvanta brings students, attendance, fees, exams, timetable, ID cards and parent
            messaging together — so your team spends less time on paperwork and more time teaching.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className={`${buttonVariants({ size: 'lg' })} w-full sm:w-auto`}>
              Start free trial <ArrowRight size={18} />
            </Link>
            <Link href="/login" className={`${buttonVariants({ variant: 'secondary', size: 'lg' })} w-full sm:w-auto`}>
              Sign in
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No card required · Set up in minutes</p>

          {/* Product preview */}
          <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-border bg-card p-3 shadow-xl">
            <div className="rounded-xl bg-muted p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Students', value: '1,248', icon: GraduationCap },
                  { label: 'Attendance', value: '96%', icon: CalendarCheck },
                  { label: 'Collected', value: 'Rs 4.2M', icon: Wallet },
                  { label: 'Classes', value: '42', icon: Users },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-card p-4 text-left">
                    <s.icon className="text-primary" size={20} />
                    <p className="mt-2 text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Everything your institution needs</h2>
            <p className="mt-3 text-muted-foreground">One connected system — no more juggling registers, spreadsheets and WhatsApp groups.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Pakistan */}
      <section id="pakistan" className="bg-sidebar py-20 text-sidebar-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Built for Pakistan</h2>
            <p className="mt-3 text-sidebar-muted">The payment methods, languages and channels your families actually use.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PAKISTAN.map((f) => (
              <div key={f.title} className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-5">
                <f.icon className="text-primary-foreground" size={22} />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-sidebar-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Simple, fair pricing</h2>
            <p className="mt-3 text-muted-foreground">Start free. Upgrade when you grow. Cancel anytime.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.name} className={`flex flex-col rounded-2xl border p-6 ${p.highlight ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-border'}`}>
                {p.highlight && <span className="mb-3 inline-block w-fit rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">Most popular</span>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-2 text-3xl font-bold">{p.price}</div>
                <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" /> <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`${buttonVariants({ variant: p.highlight ? 'primary' : 'secondary' })} mt-6 w-full`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-10 divide-y divide-border">
            {FAQ.map((item) => (
              <div key={item.q} className="py-5">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="rounded-3xl bg-sidebar px-8 py-14 text-center text-sidebar-foreground">
            <h2 className="text-3xl font-bold tracking-tight">Ready to modernise your institution?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sidebar-muted">Create your account and start your free trial today — no card required.</p>
            <Link href="/register" className={`${buttonVariants({ size: 'lg' })} mt-7`}>
              Start free trial <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <Logo size={26} />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Edvanta · edvanta.pk</p>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
            <Link href="/register" className="hover:text-foreground">Get started</Link>
            <a href="mailto:support@edvanta.pk" className="hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
