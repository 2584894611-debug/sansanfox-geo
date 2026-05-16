import Image from "next/image";
import { Activity, Eye, LineChart, Bell, Rocket, Search, ShieldCheck, FileText } from "lucide-react";
import { BrandDiagnosisForm } from "@/components/brand-diagnosis-form";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

const values = [
  { icon: Search, title: "AI搜索正在取代传统搜索", desc: "60%用户用AI搜索找品牌，传统SEO不够了" },
  { icon: Eye, title: "你的品牌可能正在隐身", desc: "在AI回答里排第几？多数品牌根本没被提及" },
  { icon: LineChart, title: "持续监控才能守住排名", desc: "竞品在动，你不动就是退，GEO是长期战" },
  { icon: Rocket, title: "优化越早优势越大", desc: "先被AI记住的品牌，后来者很难超越" },
];

const features = [
  { icon: Activity, title: "品牌GEO检测", desc: "输入品牌名，3大AI平台一键出分。豆包、DeepSeek、通义千问同时诊断，5分钟出报告。" },
  { icon: ShieldCheck, title: "五维度评分体系", desc: "AI推荐率、品牌完整度、内容权威性、差异化表达、结构化覆盖——全面量化你的AI可见度。" },
  { icon: Bell, title: "持续监控与预警", desc: "订阅后定期扫描，分数波动即时提醒，不错过任何变化机会。" },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero 区 - 深蓝渐变 */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[#E65F2B] blur-[120px]" />
            <div className="absolute bottom-10 right-20 h-96 w-96 rounded-full bg-[#00D4AA] blur-[150px]" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
                  <Image src="/logo.jpg" alt="三三狐" width={24} height={24} className="rounded-md object-cover" />
                  SanSanFox GEO
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[3.25rem]">
                  让品牌在AI搜索里<br />被看见
                </h1>
                <p className="mt-5 max-w-lg text-lg leading-7 text-white/70">
                  三三狐GEO帮你监测、诊断、优化品牌在AI平台的搜索可见度。豆包、DeepSeek、通义千问三大引擎同时诊断。
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="/#diagnose" className="inline-flex items-center gap-2 rounded-lg bg-[#E65F2B] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#E65F2B]/25 transition hover:bg-[#cf5225]">
                    免费试用
                  </a>
                  <a href="/pricing" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                    查看定价
                  </a>
                </div>
              </div>
              {/* 右侧诊断表单 */}
              <div id="diagnose">
                <BrandDiagnosisForm />
              </div>
            </div>
          </div>
        </section>

        {/* 核心价值区 */}
        <section id="features" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-[#1A365D]">为什么品牌需要GEO？</h2>
              <p className="mt-3 text-[#718096]">AI搜索正在重塑品牌曝光方式，不及时行动就会被竞争对手超越</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div key={v.title} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 transition hover:border-[#E65F2B]/30 hover:shadow-lg">
                  <v.icon className="mb-4 h-10 w-10 text-[#E65F2B]" />
                  <h3 className="mb-2 text-base font-semibold text-[#1A365D]">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-[#718096]">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 功能展示区 */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-[#1A365D]">三大核心功能</h2>
              <p className="mt-3 text-[#718096]">从检测到监控，一站式搞定品牌AI可见度</p>
            </div>
            <div className="space-y-16">
              {features.map((f, i) => (
                <div key={f.title} className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#E65F2B]/10">
                      <f.icon className="h-6 w-6 text-[#E65F2B]" />
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-[#1A365D]">{f.title}</h3>
                    <p className="text-base leading-relaxed text-[#4A5568]">{f.desc}</p>
                  </div>
                  <div className={`rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="flex items-center gap-2 text-sm text-[#718096]">
                      <Activity className="h-4 w-4 text-[#E65F2B]" />
                      示例界面
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="h-3 w-3/4 rounded bg-[#E2E8F0]" />
                      <div className="h-3 w-1/2 rounded bg-[#E2E8F0]" />
                      <div className="h-3 w-2/3 rounded bg-[#E2E8F0]" />
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-[#E65F2B]/10 p-3 text-center">
                          <div className="text-lg font-bold text-[#E65F2B]">72</div>
                          <div className="text-xs text-[#718096]">总分</div>
                        </div>
                        <div className="rounded-lg bg-[#00D4AA]/10 p-3 text-center">
                          <div className="text-lg font-bold text-[#00D4AA]">3</div>
                          <div className="text-xs text-[#718096]">被推荐</div>
                        </div>
                        <div className="rounded-lg bg-[#1A365D]/10 p-3 text-center">
                          <div className="text-lg font-bold text-[#1A365D]">5</div>
                          <div className="text-xs text-[#718096]">维度</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 底部CTA */}
        <section className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold text-white">开始监控你的品牌GEO</h2>
            <p className="mt-4 text-white/70">免费诊断，3大AI平台同时检测，5分钟出报告</p>
            <a href="/#diagnose" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#E65F2B] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#E65F2B]/25 transition hover:bg-[#cf5225]">
              <FileText className="h-5 w-5" />
              免费试用
            </a>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="border-t border-[#E2E8F0] bg-white py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-[#718096]">
              <Image src="/logo.jpg" alt="三三狐" width={20} height={20} className="rounded object-cover" />
              © 2026 三三狐GEO · 武汉爱黑马文化传媒
            </div>
            <div className="flex gap-6 text-sm text-[#718096]">
              <a href="/pricing" className="hover:text-[#1A365D]">定价方案</a>
              <a href="/#features" className="hover:text-[#1A365D]">产品功能</a>
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener" className="hover:text-[#1A365D]">鄂ICP备2025150688号</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
