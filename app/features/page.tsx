import type { Metadata } from 'next';
import Link from 'next/link';
import {
  GraduationCap, Users, CalendarCheck, Wallet, FileText, CalendarClock,
  CreditCard, MessageSquare, BarChart2, ShieldCheck, ArrowRight, Globe,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { PageHero } from '@/components/marketing/PageHero';

export const metadata: Metadata = {
  title: 'Features — Everything Your Institution Needs',
  description:
    'Explore Marksly’s features: student records, attendance, fees & invoices, exams & results, timetable, ID cards, WhatsApp & SMS parent messaging, and live reports — built for schools, colleges and academies in Pakistan.',
  alternates: { canonical: '/features' },
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

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader active="/features" />

      <PageHero
        eyebrow="Product"
        title="Everything your institution needs"
        description="One connected system — no more juggling registers, spreadsheets and WhatsApp groups."
      />

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${i % 2 === 0 ? 'bg-primary-soft text-primary' : 'bg-accent/15 text-accent-foreground'}`}>
                  <f.icon size={20} />
                </span>
                <h2 className="mt-4 font-semibold">{f.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-sidebar py-20 text-sidebar-foreground">
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-1/3 bg-accent opacity-[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Made for Pakistan</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Built for Pakistan</h2>
            <p className="mt-3 text-sidebar-muted">The payment methods, languages and channels your families actually use.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PAKISTAN.map((f) => (
              <div key={f.title} className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-5">
                <f.icon className="text-accent" size={22} />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-sidebar-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="rounded-3xl border-2 border-primary/10 bg-card px-8 py-14 text-center shadow-sm">
            <h2 className="text-3xl font-bold tracking-tight">See it in action</h2>
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
