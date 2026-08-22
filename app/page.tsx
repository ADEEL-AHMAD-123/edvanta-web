import type { Metadata } from 'next';
import Link from 'next/link';
import {
  GraduationCap, Users, CalendarCheck, Wallet, FileText, CalendarClock,
  CreditCard, MessageSquare, BarChart2, ArrowRight,
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
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'PKR',
        description: 'Free Starter plan for up to 50 students',
      },
      url: 'https://marksly.pk',
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <MarketingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary opacity-10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent opacity-10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-5 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Built for institutions in Pakistan
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Run your entire institution <span className="text-primary">in one place</span>
          </h1>
          <span aria-hidden className="mx-auto mt-5 block h-1 w-14 rounded-full bg-accent" />
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Marksly brings students, attendance, fees, exams, timetable, ID cards and parent
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
            <div className="rounded-xl bg-sidebar p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Students', value: '1,248', icon: GraduationCap },
                  { label: 'Attendance', value: '96%', icon: CalendarCheck },
                  { label: 'Collected', value: 'Rs 4.2M', icon: Wallet },
                  { label: 'Classes', value: '42', icon: Users },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-4 text-left">
                    <s.icon className="text-accent" size={20} />
                    <p className="mt-2 text-2xl font-bold text-sidebar-foreground">{s.value}</p>
                    <p className="text-xs text-sidebar-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features teaser — full list lives at /features */}
      <section className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">What’s inside</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Everything your institution needs</h2>
            <p className="mt-3 text-muted-foreground">One connected system — no more juggling registers, spreadsheets and WhatsApp groups.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.slice(0, 4).map((f, i) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${i % 2 === 0 ? 'bg-primary-soft text-primary' : 'bg-accent/15 text-accent-foreground'}`}>
                  <f.icon size={20} />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/features" className={buttonVariants({ variant: 'secondary' })}>
              See all features <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing teaser — full pricing lives at /pricing */}
      <section className="relative overflow-hidden bg-sidebar py-20 text-sidebar-foreground">
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-accent opacity-[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Pricing</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Simple, fair pricing</h2>
          <p className="mt-3 text-sidebar-muted">Free for up to 50 students. Upgrade when you grow. Cancel anytime.</p>
          <Link href="/pricing" className={`${buttonVariants({ size: 'lg' })} mt-7 bg-accent text-accent-foreground hover:bg-accent/90`}>
            View pricing <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CTA */}
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
