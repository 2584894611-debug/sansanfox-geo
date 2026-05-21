import { Metadata } from "next";
import { caseStudies } from "@/content/cases";
import { CasesClient } from "./cases-client";

export const metadata: Metadata = {
  title: "品牌GEO诊断案例 | 三三狐GEO",
  description: "查看真实品牌的GEO诊断案例，了解AI搜索品牌健康度评分，发现品牌在AI时代的优化机会",
  keywords: ["GEO案例", "品牌诊断", "AI搜索优化", "商业地产营销", "品牌健康度"],
};

export default function CasesPage() {
  // Calculate stats
  const totalBrands = caseStudies.length;
  const avgScore = Math.round(
    caseStudies.reduce((sum, c) => sum + c.geoScore, 0) / totalBrands
  );
  const uniqueIndustries = new Set(caseStudies.map((c) => c.industry)).size;

  const stats = {
    totalBrands,
    avgScore,
    topIssue: "内容权威性低",
    industriesCount: uniqueIndustries,
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1A1A2E] to-[#16213E] pb-16 pt-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            品牌GEO诊断案例
          </h1>
          <p className="mt-6 text-xl text-slate-300">
            真实品牌，真实数据，真实诊断
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-slate-400">
            深入分析品牌在AI搜索引擎中的表现，发现内容权威性、品牌完整度、差异化定位等维度的优化空间
          </p>
        </div>
      </section>

      {/* Client Component with Filters and Grid */}
      <CasesClient cases={caseStudies} stats={stats} />
    </>
  );
}
