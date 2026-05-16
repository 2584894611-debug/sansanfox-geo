import { PricingCards } from "@/components/pricing-cards";
import { SiteHeader } from "@/components/site-header";

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-64px)] bg-[#F8FAFC]">
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-[#1A365D]">套餐定价</h1>
            <p className="mt-3 text-sm leading-6 text-[#718096]">
              诊断报告全开放，订阅差异体现在品牌数量、词条额度、扫描频次和协作能力。
            </p>
          </div>
          <PricingCards />
        </section>
      </main>
    </>
  );
}
