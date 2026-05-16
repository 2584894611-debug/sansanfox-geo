import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "产品功能", href: "/#features" },
  { label: "定价方案", href: "/pricing" },
  { label: "案例", href: "/report/demo-sample-report" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="三三狐" width={40} height={40} className="rounded-[8px] object-cover" priority />
          <span className="text-lg font-bold text-[#1A365D]">三三狐 GEO</span>
        </Link>
        <nav className="flex items-center gap-1">
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
      </div>
    </header>
  );
}
