import type { Metadata } from 'next';
import Link from 'next/link';
import {
  GraduationCap, Users, CalendarCheck, Wallet, FileText, CalendarClock,
  CreditCard, MessageSquare, BarChart2, ArrowRight, Bell, TrendingUp,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export const metadata: Metadata = {
  title: 'Marksly — School & Campus Management Software for Pakistan',
  description:
    'Marksly is an all-in-one management system for academies, schools, colleges and universities in Pakistan — students, attendance, fees, exams, timetable, ID cards and parent messaging in one place.',
  alternates: { canonical: '/' },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://marksly.pk/#organization',
      name: 'Marksly',
      url: 'https://marksly.pk',
      logo: 'https://marksly.pk/logo-full.svg',
      email: 'support@marksly.pk',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Marksly',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'All-in-one school and campus management software for academies, schools, colleges and universities in Pakistan — students, attendance, fees, exams, timetable, ID cards and parent messaging.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR', description: 'Free Starter plan for up to 50 students' },
      url: 'https://marksly.pk',
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <MarketingHeader />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary opacity-[0.07] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-accent opacity-[0.08] blur-3xl" />

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 py-20 md:py-28 lg:grid-cols-[1.05fr_1fr]">
          {/* Left: copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Built for institutions in Pakistan
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.4rem]">
              Run your entire <span className="text-primary">institution</span> in one place
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Marksly brings students, attendance, fees, exams, timetable, ID cards and parent
              messaging together — so your team spends less time on paperwork and more time teaching.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className={`${buttonVariants({ size: 'lg' })} w-full sm:w-auto`}>
                Start free trial <ArrowRight size={18} />
              </Link>
              <Link href="/pricing" className={`${buttonVariants({ variant: 'secondary', size: 'lg' })} w-full sm:w-auto`}>
                View pricing
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No card required · Set up in minutes</p>

            <div className="mt-10 flex items-center gap-6 border-t border-border pt-6">
              {[
                { label: 'Free up to', value: '50 students' },
                { label: 'Setup time', value: '< 10 minutes' },
                { label: 'Languages', value: 'Urdu & English' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-base font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: premium product mockup — browser chrome + fake dashboard */}
          <div className="relative">
            <div aria-hidden className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-accent/10 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              {/* browser chrome */}
              <div className="flex items-center gap-1.5 border-b border-border bg-muted px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-3 rounded-md bg-card px-3 py-1 text-[11px] text-muted-foreground">app.marksly.pk/dashboard</span>
              </div>
              {/* fake dashboard */}
              <div className="flex bg-background">
                {/* sidebar */}
                <div className="hidden w-14 flex-col items-center gap-4 bg-sidebar py-5 sm:flex">
                  <span className="h-6 w-6 rounded-md bg-accent" />
                  {[GraduationCap, CalendarCheck, Wallet, FileText, MessageSquare].map((Icon, i) => (
                    <Icon key={i} size={16} className={i === 0 ? 'text-accent' : 'text-sidebar-muted'} />
                  ))}
                </div>
                {/* content */}
                <div className="flex-1 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Dashboard</p>
                    <Bell size={14} className="text-muted-foreground" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: 'Students', value: '1,248', icon: GraduationCap, up: true },
                      { label: 'Attendance', value: '96%', icon: CalendarCheck, up: true },
                      { label: 'Collected', value: 'Rs 4.2M', icon: Wallet, up: true },
                      { label: 'Classes', value: '42', icon: Users, up: false },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary-soft text-primary">
                            <s.icon size={14} />
                          </span>
                          {s.up && <TrendingUp size={12} className="text-success" />}
                        </div>
                        <p className="mt-2 text-lg font-bold">{s.value}</p>
                        <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-border bg-card p-3.5 shadow-sm">
                    <p className="text-[11px] font-medium text-muted-foreground">Fee collection this week</p>
                    <div className="mt-2 flex h-14 items-end gap-1.5">
                      {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`flex-1 rounded-sm ${i === 5 ? 'bg-accent' : 'bg-primary/25'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features: bento grid ─────────────────────────────────────── */}
      <section className="border-b border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">What's inside</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Everything your institution needs</h2>
            <p className="mt-3 text-muted-foreground">One connected system — no more juggling registers, spreadsheets and WhatsApp groups.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6">
            {/* large feature card */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-sidebar p-8 text-sidebar-foreground shadow-sm md:col-span-4 md:row-span-2">
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent opacity-[0.08] blur-2xl" />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Wallet size={24} />
              </span>
              <h3 className="mt-5 text-2xl font-bold">Fees & billing, fully automated</h3>
              <p className="mt-2 max-w-md text-sidebar-muted">
                Fee structures, monthly auto-billing, discounts and fines, receipts, dues tracking —
                and optional auto-renewal so subscription payments never slip through the cracks.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Invoices', 'Auto-renewal', 'JazzCash', 'EasyPaisa', 'Bank transfer'].map((t) => (
                  <span key={t} className="rounded-full border border-sidebar-border bg-sidebar-accent/50 px-3 py-1 text-xs">{t}</span>
                ))}
              </div>
            </div>

            {[
              { icon: GraduationCap, title: 'Student records', desc: 'Admissions, profiles, classes and sections with bulk CSV import.' },
              { icon: CalendarCheck, title: 'Attendance', desc: 'Teachers mark classes in seconds; admins see rates instantly.' },
              { icon: FileText, title: 'Exams & results', desc: 'Fast marks entry, published straight to students and parents.' },
              { icon: CalendarClock, title: 'Timetable', desc: 'Weekly schedules per section, with one-tap attendance.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:col-span-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}

            {/* wide messaging card */}
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 shadow-sm md:col-span-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <MessageSquare size={20} />
              </span>
              <h3 className="mt-4 font-semibold">WhatsApp & SMS messaging</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">Attendance alerts, fee reminders and notices — delivered where parents already are, in Urdu or English.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:col-span-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <CreditCard size={20} />
              </span>
              <h3 className="mt-4 font-semibold">ID cards & reports</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">Printable QR ID cards, plus live dashboards across attendance, fees and results.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/features" className={buttonVariants({ variant: 'secondary' })}>
              See all features <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-sidebar py-20 text-sidebar-foreground">
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-accent opacity-[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Pricing</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Simple, fair pricing</h2>
          <p className="mt-3 text-sidebar-muted">Free for up to 50 students. Upgrade when you grow. Cancel anytime.</p>
          <Link href="/pricing" className={`${buttonVariants({ size: 'lg' })} mt-7 bg-accent text-accent-foreground hover:bg-accent/90`}>
            View pricing <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="rounded-3xl border-2 border-primary/10 bg-card px-8 py-14 text-center shadow-sm">
            <h2 className="text-3xl font-bold tracking-tight">Ready to modernise your institution?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Create your account and start your free trial today — no card required.</p>
            <Link href="/register" className={`${buttonVariants({ size: 'lg' })} mt-7`}>
              Start free trial <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
