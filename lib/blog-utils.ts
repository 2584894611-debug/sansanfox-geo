// Client-safe utility functions (no fs module)

export interface PostMeta {
  title: string;
  slug: string;
  description: string;
  category: string;
  publishedAt: string;
  readTime: number;
}

export function getCategoryGradient(category: string): { from: string; to: string } {
  const gradients: Record<string, { from: string; to: string }> = {
    'GEO基础': { from: '#E65F2B', to: '#FF8C42' },
    '行业洞察': { from: '#1A365D', to: '#2A4A7F' },
    '产品动态': { from: '#48BB78', to: '#38A169' },
    '操作指南': { from: '#805AD5', to: '#6B46C1' },
  };
  
  return gradients[category] || { from: '#718096', to: '#4A5568' };
}

export function getCategoryBadgeVariant(category: string): 'default' | 'orange' | 'blue' | 'green' | 'red' {
  const variants: Record<string, 'default' | 'orange' | 'blue' | 'green' | 'red'> = {
    'GEO基础': 'orange',
    '行业洞察': 'blue',
    '产品动态': 'green',
    '操作指南': 'default',
  };
  
  return variants[category] || 'default';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}
