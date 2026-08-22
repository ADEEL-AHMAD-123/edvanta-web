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
      <section className="pb-14 sm:pb-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border p-4 sm:p-6 ${
                  p.highlight ? 'border-accent bg-card shadow-xl ring-1 ring-accent/30' : 'border-border bg-card shadow-sm'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground shadow sm:-top-3 sm:left-6 sm:px-3 sm:py-1 sm:text-xs">
                    Most popular
                  </span>
                )}
                <div className="flex items-baseline justify-between gap-3 sm:block">
                  <h2 className="text-base font-semibold sm:text-lg">{p.name}</h2>
                  <div className="text-xl font-bold text-primary sm:mt-2 sm:text-3xl">{p.price}</div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
                <ul className="mt-4 flex-1 space-y-2 sm:mt-5 sm:space-y-2.5">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-[13px] sm:text-sm">
                      <Check aria-hidden size={15} className="mt-0.5 shrink-0 text-success sm:mt-0.5" /> <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.name === 'Institution' ? '/contact' : '/register'}
                  className={`${buttonVariants({ variant: p.highlight ? 'primary' : 'secondary' })} mt-5 w-full sm:mt-6 ${p.highlight ? '!bg-accent !text-accent-foreground hover:!bg-accent/90' : ''}`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 px-4 text-center text-xs text-muted-foreground sm:mt-8 sm:px-0 sm:text-sm">
            Prefer annual billing?{' '}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              Contact us
            </Link>{' '}
            for discounted annual pricing on Growth and Institution.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-card/40 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">FAQ</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Pricing questions</h2>
          </div>
          <div className="mt-8 divide-y divide-border sm:mt-10">
            {FAQ.map((item) => (
              <div key={item.q} className="py-4 sm:py-5">
                <h3 className="text-sm font-semibold sm:text-base">{item.q}</h3>
                <p className="mt-2 text-[13px] text-muted-foreground sm:text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-sidebar py-14 text-sidebar-foreground sm:py-20">
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-accent opacity-[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to modernise your institution?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-sidebar-muted sm:text-base">Create your account and start your free trial today — no card required.</p>
          <Link href="/register" className={`${buttonVariants({ size: 'lg' })} mt-7 w-full !bg-accent !text-accent-foreground hover:!bg-accent/90 sm:w-auto`}>
            Start free trial <ArrowRight aria-hidden size={18} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
