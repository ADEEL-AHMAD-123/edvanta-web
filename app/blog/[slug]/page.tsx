import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { BLOG_POSTS, getPostBySlug } from '../posts';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader active="/blog" />

      <article className="mx-auto max-w-2xl px-5 py-16">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft size={14} /> Back to blog
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-accent">
          {new Date(post.date).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
          {' · '}{post.readingTime}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
        <span aria-hidden className="mt-5 block h-1 w-14 rounded-full bg-accent" />

        <div className="mt-8">
          {post.body.map((para, i) =>
            para.startsWith('## ') ? (
              <h2 key={i} className="mt-8 border-l-2 border-accent pl-3 text-xl font-bold tracking-tight text-foreground">
                {para.replace('## ', '')}
              </h2>
            ) : (
              <p key={i} className="mt-4 leading-relaxed text-foreground/90">
                {para}
              </p>
            )
          )}
        </div>
      </article>

      <section className="relative overflow-hidden bg-sidebar py-16 text-sidebar-foreground">
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-accent opacity-[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Ready to try Marksly?</h2>
          <p className="mx-auto mt-2 max-w-md text-sidebar-muted">
            Start free — no card required, set up in minutes.
          </p>
          <Link href="/register" className={`${buttonVariants({ size: 'lg' })} mt-6 bg-accent text-accent-foreground hover:bg-accent/90`}>
            Start free trial <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
