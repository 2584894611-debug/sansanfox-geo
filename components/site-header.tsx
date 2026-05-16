"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "产品功能", href: "/#features" },
  { label: "知识库", href: "/blog" },
  { label: "定价方案", href: "/pricing" },
  { label: "案例", href: "/report/demo-sample-report" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="三三狐" width={40} height={40} className="rounded-[8px] object-cover" priority />
          <span className="text-lg font-bold text-[#1A365D]">三三狐 GEO</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button asChild variant="ghost" size="sm" key={item.href} className="text-[#4A5568] hover:text-[#1A365D]">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <Button asChild variant="outline" size="sm" className="ml-2 border-[#CBD5E0] text-[#1A365D] hover:bg-[#EDF2F7]">
            <Link href="/login">登录</Link>
          </Button>
          <Button asChild size="sm" className="ml-2 bg-[#E65F2B] hover:bg-[#cf5225] text-white">
            <Link href="/#diagnose">免费试用</Link>
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#4A5568] hover:bg-[#EDF2F7] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="border-t border-[#E2E8F0] bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[#4A5568] hover:bg-[#EDF2F7] hover:text-[#1A365D]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1 border-[#CBD5E0] text-[#1A365D]">
                <Link href="/login" onClick={() => setMobileOpen(false)}>登录</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 bg-[#E65F2B] hover:bg-[#cf5225] text-white">
                <Link href="/#diagnose" onClick={() => setMobileOpen(false)}>免费试用</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
