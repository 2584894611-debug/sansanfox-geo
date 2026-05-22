import { LoginForm } from "@/components/login-form";
import { PricingCards } from "@/components/pricing-cards";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#F8FAFC]">
        <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#1A365D]">保存诊断，开启持续监控</h1>
            <p className="mt-3 text-sm leading-6 text-[#718096]">
              免费版可保存1个品牌、10个监控词条，并支持自动触发扫描。
            </p>
            <div className="mt-6">
              <LoginForm />
            </div>
          </div>
          <PricingCards compact />
        </section>
      </main>
    </>
  );
}
