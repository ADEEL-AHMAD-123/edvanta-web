import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { PageHero } from '@/components/marketing/PageHero';

export const metadata: Metadata = {
  title: 'Pricing — Marksly School & Campus Management Software',
  description:
    'Simple, transparent pricing for Marksly — the school management system built for academies, schools, colleges and universities in Pakistan. Start free, upgrade as you grow.',
  alternates: { canonical: '/pricing' },
};

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
  { q: 'Is there a free plan?', a: 'Yes — the Starter plan is free for up to 50 students, with no card required and no time limit.' },
  { q: 'Can I cancel anytime?', a: 'Yes. There are no long-term contracts — upgrade, downgrade or cancel whenever you need to.' },
  { q: 'How do I pay?', a: 'Growth-plan subscriptions are billed by card through a secure payment page, with optional auto-renewal so you never have to remember to pay manually. Bank transfer is also available.' },
  { q: 'What happens if I go over my student limit?', a: 'We’ll let you know before you hit the limit so you can upgrade — your data and access are never cut off without warning.' },
  { q: 'Do you offer discounts for annual billing?', a: 'Yes — contact us for annual pricing on the Growth and Institution plans.' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader active="/pricing" />

      <PageHero
        eyebrow="Pricing"
        title="Simple, fair pricing"
        description="Start free. Upgrade when you grow. No card required to begin, cancel anytime."
      />

      {/* Plans */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  p.highlight ? 'border-accent bg-card shadow-xl ring-1 ring-accent/30' : 'border-border bg-card shadow-sm'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground shadow">
                    Most popular
                  </span>
                )}
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <div className="mt-2 text-3xl font-bold text-primary">{p.price}</div>
                <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" /> <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.name === 'Institution' ? '/contact' : '/register'}
                  className={`${buttonVariants({ variant: p.highlight ? 'primary' : 'secondary' })} mt-6 w-full ${p.highlight ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                >
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
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Pricing questions</h2>
          </div>
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
      <section className="relative overflow-hidden bg-sidebar py-20 text-sidebar-foreground">
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-accent opacity-[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to modernise your institution?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sidebar-muted">Create your account and start your free trial today — no card required.</p>
          <Link href="/register" className={`${buttonVariants({ size: 'lg' })} mt-7 bg-accent text-accent-foreground hover:bg-accent/90`}>
            Start free trial <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
