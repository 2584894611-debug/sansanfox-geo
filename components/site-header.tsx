import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="三三狐" width={40} height={40} className="rounded-[8px] object-cover" priority />
          <span className="text-lg font-bold text-[#1A365D]">三三狐 GEO</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/pricing">定价</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">登录</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
