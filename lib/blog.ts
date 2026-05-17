import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { getCategoryGradient, getCategoryBadgeVariant, formatDate } from './blog-utils';

export interface PostFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: string;
  publishedAt: string;
  readTime: number;
}

export interface Post extends PostFrontmatter {
  content: string;
  contentHtml: string;
}

export interface PostMeta extends PostFrontmatter {
  content?: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

function getPostBySlug(slug: string, includeContent = false): Post | PostMeta | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const frontmatter: PostFrontmatter = {
    title: data.title || '',
    slug: data.slug || slug,
    description: data.description || '',
    category: data.category || '未分类',
    publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
    readTime: data.readTime || 5,
  };

  if (!includeContent) {
    return frontmatter;
  }

  return {
    ...frontmatter,
    content,
    contentHtml: '',
  } as Post;
}

export async function getPostBySlugAsync(slug: string): Promise<Post | null> {
  const post = getPostBySlug(slug, true);
  
  if (!post || !('content' in post)) {
    return null;
  }

  const processedContent = await remark()
    .use(remarkGfm).use(remarkHtml, { sanitize: false })
    .process(post.content);
  
  const contentHtml = processedContent.toString();

  return {
    ...post,
    contentHtml,
  } as Post;
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is PostMeta => post !== null)
    .sort((post1, post2) => {
      const date1 = new Date(post1.publishedAt);
      const date2 = new Date(post2.publishedAt);
      return date2.getTime() - date1.getTime();
    });
  
  return posts;
}

export function getPostsByCategory(category: string): PostMeta[] {
  const allPosts = getAllPosts();
  
  if (category === '全部') {
    return allPosts;
  }
  
  return allPosts.filter((post) => post.category === category);
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): PostMeta[] {
  const allPosts = getAllPosts();
  
  return allPosts
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  return ['全部', ...categories];
}

// Re-export utility functions for backwards compatibility
export { formatDate, getCategoryGradient, getCategoryBadgeVariant };
