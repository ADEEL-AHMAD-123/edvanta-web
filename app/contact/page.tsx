import type { Metadata } from 'next';
import { Mail, MessageCircle, Clock, ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { PageHero } from '@/components/marketing/PageHero';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Marksly team — questions about pricing, a demo for your school or college, or support for an existing account.',
  alternates: { canonical: '/contact' },
};

const CHANNELS = [
  {
    icon: Mail,
    title: 'Email',
    detail: 'support@marksly.pk',
    href: 'mailto:support@marksly.pk',
    note: 'For sales questions, demos, and general support — we reply within one business day.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    detail: '+92 317 5496466',
    href: 'https://wa.me/923175496466',
    note: 'Fastest way to reach us for a quick question or to book a live demo.',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader active="/contact" />

      <PageHero
        eyebrow="Contact"
        title="Talk to us"
        description="Questions about pricing, a demo for your institution, or help with your account — we’re here for it."
      />

      <section className="pb-20">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-5 sm:grid-cols-2">
          {CHANNELS.map((c, i) => (
            <a
              key={c.title}
              href={c.href}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${i % 2 === 0 ? 'bg-primary-soft text-primary' : 'bg-accent/15 text-accent-foreground'}`}>
                <c.icon size={22} />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{c.title}</h2>
              <p className="mt-1 font-medium text-primary">{c.detail}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Reach out <ArrowRight size={14} />
              </span>
            </a>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl items-start gap-3 rounded-2xl border border-border bg-card/60 p-6">
          <Clock className="mt-0.5 shrink-0 text-primary" size={20} />
          <div>
            <h3 className="font-semibold">Response times</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We typically reply within one business day. Existing customers with an urgent
              account issue should sign in and use the support option in their dashboard for the
              fastest response.
            </p>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
