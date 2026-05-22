import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllPosts, getPostBySlugAsync, getRelatedPosts, formatDate, getCategoryBadgeVariant } from '@/lib/blog';

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugAsync(slug);
  
  if (!post) {
    return {
      title: '文章未找到 - 三三狐GEO',
    };
  }

  return {
    title: `${post.title} - 三三狐GEO知识库`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlugAsync(slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.category);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.description,
    'author': {
      '@type': 'Organization',
      'name': '三三狐GEO',
      'url': 'https://xhpj.cloud',
    },
    'publisher': {
      '@type': 'Organization',
      'name': '三三狐GEO',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://xhpj.cloud/logo.jpg',
      },
    },
    'datePublished': post.publishedAt,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://xhpj.cloud/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <SiteHeader />
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* 面包屑导航 */}
        <div className="border-b border-[#E2E8F0] bg-white">
          <div className="mx-auto max-w-4xl px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-[#718096]">
              <Link href="/" className="hover:text-[#E65F2B]">首页</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/blog" className="hover:text-[#E65F2B]">知识库</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[#1A365D]">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* 文章主体 */}
        <article className="mx-auto max-w-4xl px-4 py-12">
          {/* 文章头部 */}
          <header className="mb-10">
            <div className="mb-4">
              <Badge variant={getCategoryBadgeVariant(post.category)}>
                {post.category}
              </Badge>
            </div>
            <h1 className="mb-6 text-3xl font-bold leading-tight text-[#1A365D] md:text-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#718096]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime} 分钟阅读
              </span>
            </div>
          </header>

          {/* 文章正文 */}
          <div 
            className="prose prose-lg max-w-none"
            style={{
              '--tw-prose-body': '#2D3748',
              '--tw-prose-headings': '#1A365D',
              '--tw-prose-links': '#E65F2B',
              '--tw-prose-bold': '#1A365D',
              '--tw-prose-code': '#E65F2B',
              '--tw-prose-quotes': '#718096',
              '--tw-prose-quote-borders': '#E65F2B',
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* 底部CTA */}
          <div className="mt-16 rounded-xl bg-gradient-to-r from-[#1A365D] to-[#2A4A7F] p-8 text-center text-white">
            <h3 className="mb-2 text-xl font-bold">想了解你的品牌GEO分数？</h3>
            <p className="mb-6 text-white/80">免费诊断，3大AI平台同时检测，5分钟出报告</p>
            <Button asChild size="lg" className="bg-[#E65F2B] hover:bg-[#cf5225]">
              <Link href="/#diagnose">
                立即免费诊断
              </Link>
            </Button>
          </div>

          {/* 返回链接 */}
          <div className="mt-8 text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-[#718096] hover:text-[#E65F2B]"
            >
              <ArrowLeft className="h-4 w-4" />
              返回知识库
            </Link>
          </div>
        </article>

        {/* 相关文章推荐 */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-[#E2E8F0] bg-white py-12">
            <div className="mx-auto max-w-4xl px-4">
              <h2 className="mb-6 text-xl font-bold text-[#1A365D]">相关推荐</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    href={`/blog/${relatedPost.slug}`} 
                    key={relatedPost.slug}
                    className="group rounded-lg border border-[#E2E8F0] p-4 transition-all hover:border-[#E65F2B]/30 hover:shadow-md"
                  >
                    <Badge variant={getCategoryBadgeVariant(relatedPost.category)} className="mb-2">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="line-clamp-2 text-sm font-semibold text-[#1A365D] transition-colors group-hover:text-[#E65F2B]">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs text-[#718096]">
                      {relatedPost.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 页脚 */}
        <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC] py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-[#718096]">
              © 2026 三三狐GEO · 武汉爱黑马文化传媒
            </div>
            <div className="flex gap-6 text-sm text-[#718096]">
              <Link href="/" className="hover:text-[#1A365D]">首页</Link>
              <Link href="/blog" className="hover:text-[#1A365D]">知识库</Link>
              <Link href="/pricing" className="hover:text-[#1A365D]">定价方案</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
