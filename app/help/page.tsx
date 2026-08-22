import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { PageHero } from '@/components/marketing/PageHero';

export const metadata: Metadata = {
  title: 'Help Center',
  description:
    'Answers to common Marksly questions — getting started, fees & billing, WhatsApp/SMS messaging, students & attendance, and account security.',
  alternates: { canonical: '/help' },
};

const TOPICS = [
  {
    category: 'Getting started',
    items: [
      { q: 'How do I create my institution’s account?', a: 'Click “Start free trial” on the homepage, fill in your institution’s details, and verify your email — your account is ready in a couple of minutes, no card required.' },
      { q: 'Is Marksly only for schools?', a: 'No — it works for academies, schools, colleges and universities. The modules and terminology adapt to your institution type.' },
      { q: 'Can I import my existing student data?', a: 'Yes — the Students module supports bulk CSV import, so you can bring in your existing roster instead of entering students one by one.' },
    ],
  },
  {
    category: 'Fees & billing',
    items: [
      { q: 'How does subscription billing work?', a: 'Growth-plan subscriptions are billed monthly through a secure card checkout, with optional auto-renewal so you don’t have to remember to pay each month. Bank transfer is also available if you’d rather pay manually.' },
      { q: 'Can I turn off auto-renewal?', a: 'Yes — go to your Billing settings and disable auto-renewal at any time. Your saved card is removed from our system when you do.' },
      { q: 'How do parents pay student fees?', a: 'You record fee payments however your institution already collects them — cash, bank transfer, JazzCash, or EasyPaisa — and Marksly tracks invoices, dues, and receipts for you.' },
      { q: 'What happens if a payment fails?', a: 'Failed auto-renewal charges are retried automatically over the following week. If it still doesn’t go through, your account moves to a grace period rather than being cut off immediately, and you’ll be notified by email.' },
    ],
  },
  {
    category: 'Messaging',
    items: [
      { q: 'Do you support WhatsApp and SMS?', a: 'Yes. Once your provider keys are connected, you can send attendance alerts, fee reminders, and notices to parents and staff via WhatsApp or SMS, with a full delivery log.' },
      { q: 'Can I send messages in Urdu?', a: 'Yes — the interface and messaging both support Urdu alongside English.' },
    ],
  },
  {
    category: 'Account & security',
    items: [
      { q: 'Is my institution’s data isolated from others?', a: 'Yes — Marksly is fully multi-tenant. Every institution’s data is isolated and protected, with role-based access so staff only see what their role permits.' },
      { q: 'I forgot my password — what do I do?', a: 'Use “Forgot password” on the sign-in page to receive a reset link by email.' },
      { q: 'How do I delete or deactivate a staff account?', a: 'An institution admin can deactivate any user from the Users section in the dashboard — this immediately revokes their access.' },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader active="/help" />

      <PageHero
        eyebrow="Help Center"
        title="How can we help?"
        description={
          <>
            Answers to the questions we hear most. Can’t find what you need?{' '}
            <Link href="/contact" className="font-medium text-primary hover:underline">Contact us</Link> directly.
          </>
        }
      />

      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-5 space-y-12">
          {TOPICS.map((section, si) => (
            <div key={section.category}>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${si % 2 === 0 ? 'bg-primary' : 'bg-accent'}`} />
                <h2 className="text-xl font-bold tracking-tight">{section.category}</h2>
              </div>
              <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
                {section.items.map((item) => (
                  <div key={item.q} className="p-5">
                    <h3 className="font-semibold">{item.q}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-sidebar py-16 text-sidebar-foreground">
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-1/3 bg-accent opacity-[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Still need help?</h2>
          <p className="mx-auto mt-2 max-w-md text-sidebar-muted">
            Our team is happy to walk you through anything Marksly can do for your institution.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="mailto:support@marksly.pk" className={`${buttonVariants({ variant: 'secondary' })} w-full sm:w-auto`}>
              <Mail size={16} /> Email support
            </a>
            <Link href="/contact" className={`${buttonVariants()} w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90`}>
              <MessageCircle size={16} /> Contact us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
