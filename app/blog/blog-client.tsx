'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, TrendingUp, Lightbulb, Megaphone, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PostMeta, formatDate, getCategoryGradient, getCategoryBadgeVariant } from '@/lib/blog-utils';

const categoryIcons: Record<string, React.ElementType> = {
  'GEO基础': TrendingUp,
  '行业洞察': Lightbulb,
  '产品动态': Megaphone,
  '操作指南': Wrench,
};

interface BlogClientProps {
  posts: PostMeta[];
  categories: string[];
}

export default function BlogClient({ posts, categories }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === '全部' || post.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div>
      {/* 搜索和筛选 */}
      <div className="mb-8 space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#718096]" />
          <Input
            type="text"
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-[#E65F2B] text-white shadow-md'
                  : 'bg-white text-[#718096] hover:bg-[#EDF2F7] hover:text-[#1A365D]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 文章列表 */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[#718096]">没有找到相关文章</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
            const gradient = getCategoryGradient(post.category);
            const badgeVariant = getCategoryBadgeVariant(post.category);
            const CategoryIcon = categoryIcons[post.category] || TrendingUp;

            return (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <article className="group h-full overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  {/* 封面区域 - 渐变色块 */}
                  <div
                    className="relative flex h-40 items-center justify-center overflow-hidden p-6"
                    style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                    }}
                  >
                    <CategoryIcon className="h-16 w-16 text-white/30" />
                    <div className="absolute inset-0 bg-black/5" />
                  </div>

                  {/* 内容区域 */}
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant={badgeVariant}>{post.category}</Badge>
                    </div>

                    <h2 className="mb-2 line-clamp-2 text-lg font-bold text-[#1A365D] transition-colors group-hover:text-[#E65F2B]">
                      {post.title}
                    </h2>

                    <p className="mb-4 line-clamp-2 text-sm text-[#718096]">
                      {post.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#A0AEC0]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span>{post.readTime} 分钟阅读</span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
