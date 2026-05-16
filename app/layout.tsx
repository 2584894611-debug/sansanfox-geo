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
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
