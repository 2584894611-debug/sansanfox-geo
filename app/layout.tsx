import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "三三狐 GEO 优化平台",
  description: "输入品牌词，即刻生成 AI 可见度诊断报告",
  icons: {
    icon: "/logo.jpg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "三三狐GEO",
    "url": "https://xhpj.cloud",
    "description": "AI搜索时代的品牌可见度优化平台，帮助品牌在豆包、DeepSeek、通义千问等AI搜索中被发现和推荐",
    "logo": "https://xhpj.cloud/logo.jpg",
    "sameAs": [
      "https://github.com/2584894611-debug/sansanfox-geo"
    ]
  };

  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
