import Image from "next/image";
import { Activity, FileText, ShieldCheck } from "lucide-react";
import { BrandDiagnosisForm } from "@/components/brand-diagnosis-form";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const stats = [
  { label: "MVP模型", value: "3", icon: Activity },
  { label: "报告内容墙", value: "0", icon: ShieldCheck },
  { label: "免费词条", value: "10", icon: FileText }
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl content-center gap-8 px-4 py-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-semibold text-[#1A365D]">
                  <Image src="/logo.jpg" alt="三三狐" width={28} height={28} className="rounded-md object-cover" />
                  SanSanFox GEO
                </div>
                <h1 className="text-4xl font-bold leading-tight text-[#1A365D] md:text-5xl">
                  输入品牌词，看看 AI 怎么评价你
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#4A5568]">
                  三三狐聚合豆包、DeepSeek、通义千问的公开回答，生成五维度 GEO 可见度诊断报告。
                </p>
                <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
                  {stats.map((stat) => (
                    <Card key={stat.label} className="rounded-lg">
                      <CardContent className="p-4">
                        <stat.icon className="mb-3 h-5 w-5 text-[#E65F2B]" />
                        <div className="font-mono text-2xl font-bold text-[#1A365D]">{stat.value}</div>
                        <div className="mt-1 text-xs text-[#718096]">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <BrandDiagnosisForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
