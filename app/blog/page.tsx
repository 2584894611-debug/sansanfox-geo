import { Metadata } from 'next';
import Link from 'next/link';
import { Search, Clock, BookOpen } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAllPosts, getAllCategories, getCategoryBadgeVariant } from '@/lib/blog';
import BlogClient from './blog-client';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: '三三狐GEO知识库 - 深入理解AI搜索时代的品牌可见度优化',
  description: '探索GEO（生成式引擎优化）的核心概念、实践策略和行业洞察。三三狐GEO知识库帮助你理解AI搜索时代的品牌优化之道。',
  openGraph: {
    title: '三三狐GEO知识库',
    description: '深入理解AI搜索时代的品牌可见度优化',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': '三三狐GEO知识库',
    'description': '深入理解AI搜索时代的品牌可见度优化',
    'url': 'https://xhpj.cloud/blog',
    'publisher': {
      '@type': 'Organization',
      'name': '三三狐GEO',
      'url': 'https://xhpj.cloud',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* 顶部标题区 */}
        <section className="bg-gradient-to-br from-[#1A365D] to-[#2A4A7F] py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
                <BookOpen className="h-4 w-4" />
                知识库
              </div>
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                三三狐GEO知识库
              </h1>
              <p className="mt-4 text-lg text-white/70">
                深入理解AI搜索时代的品牌可见度优化
              </p>
            </div>
          </div>
        </section>

        {/* 博客内容区 */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <BlogClient posts={posts} categories={categories} />
        </section>

        {/* 底部CTA */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold text-[#1A365D]">
              想了解你的品牌GEO分数？
            </h2>
            <p className="mt-2 text-[#718096]">
              立即免费诊断，发现品牌在AI搜索中的真实表现
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/#diagnose">
                立即免费诊断
              </Link>
            </Button>
          </div>
        </section>

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
