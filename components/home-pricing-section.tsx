"use client";

import { Check, X, Star } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "免费版",
    price: "¥0",
    period: "永久免费",
    description: "适合个人尝鲜体验",
    features: [
      { text: "每月1次品牌诊断", included: true },
      { text: "3大AI平台检测", included: true },
      { text: "基础GEO评分", included: true },
      { text: "AI回答原文展示", included: true },
      { text: "监控仪表盘", included: false },
      { text: "竞品对比", included: false },
      { text: "预警通知", included: false },
      { text: "白标报告", included: false },
    ],
    cta: "免费开始",
    href: "/#diagnose",
    highlight: false,
    badge: null,
  },
  {
    name: "专业版",
    price: "¥399",
    period: "/月",
    description: "最适合成长型品牌",
    features: [
      { text: "每日自动诊断扫描", included: true },
      { text: "完整9大AI平台", included: true },
      { text: "高级GEO评分体系", included: true },
      { text: "监控仪表盘", included: true },
      { text: "3个竞品对比", included: true },
      { text: "邮件预警通知", included: true },
      { text: "优化建议引擎", included: true },
      { text: "白标报告", included: false },
    ],
    cta: "立即订阅",
    href: "/pricing",
    highlight: true,
    badge: "最受欢迎",
  },
  {
    name: "企业版",
    price: "¥2,999",
    period: "起/月",
    description: "适合大型品牌机构",
    features: [
      { text: "实时监控+自定义扫描", included: true },
      { text: "无限AI平台", included: true },
      { text: "全维度分析报告", included: true },
      { text: "专属仪表盘", included: true },
      { text: "无限竞品对比", included: true },
      { text: "多渠道预警通知", included: true },
      { text: "专业优化落地服务", included: true },
      { text: "白标报告", included: true },
    ],
    cta: "联系销售",
    href: "/pricing",
    highlight: false,
    badge: null,
    dark: true,
  },
];

export function HomePricingSection() {
  return (
    <section id="pricing" className="bg-[#F8FAFC] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[#1A365D]">简单透明的定价</h2>
          <p className="mt-3 text-[#718096]">所有方案均含3大核心AI平台检测，按需选择即可</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl ${
                plan.highlight
                  ? "border-2 border-[#E65F2B] shadow-xl shadow-[#E65F2B]/10"
                  : plan.dark
                  ? "bg-[#1A1A2E] text-white"
                  : "border border-[#E2E8F0] bg-white"
              }`}
            >
              {/* 标签 */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E65F2B] px-4 py-1 text-xs font-semibold text-white">
                    <Star className="h-3 w-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* 头部 */}
              <div className={`p-6 ${plan.highlight ? "border-b border-[#E2E8F0]/50" : "border-b border-white/10"}`}>
                <h3 className={`text-lg font-semibold ${plan.dark ? "text-white" : "text-[#1A365D]"}`}>
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${plan.highlight ? "text-[#E65F2B]" : plan.dark ? "text-white" : "text-[#1A365D]"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.dark ? "text-white/60" : "text-[#718096]"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${plan.dark ? "text-white/60" : "text-[#718096]"}`}>
                  {plan.description}
                </p>
              </div>

              {/* 功能列表 */}
              <div className={`flex-1 p-6 ${plan.highlight ? "" : plan.dark ? "border-t border-white/10" : "border-t border-[#E2E8F0]"}`}>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.dark ? "text-[#48BB78]" : plan.highlight ? "text-[#48BB78]" : "text-[#48BB78]"}`} />
                      ) : (
                        <X className={`mt-0.5 h-4 w-4 shrink-0 ${plan.dark ? "text-white/30" : "text-[#CBD5E0]"}`} />
                      )}
                      <span className={`text-sm ${feature.included ? (plan.dark ? "text-white/90" : "text-[#2D3748]") : (plan.dark ? "text-white/40 line-through" : "text-[#A0AEC0] line-through")}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className={`p-6 ${plan.highlight ? "border-t border-[#E2E8F0]/50" : plan.dark ? "border-t border-white/10" : "border-t border-[#E2E8F0]"}`}>
                <Link
                  href={plan.href}
                  className={`block w-full rounded-lg py-3 text-center text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-[#E65F2B] text-white hover:bg-[#cf5225]"
                      : plan.dark
                      ? "bg-white text-[#1A365D] hover:bg-[#EDF2F7]"
                      : "border border-[#CBD5E0] text-[#1A365D] hover:bg-[#EDF2F7]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#718096]">
          疑惑？<Link href="/pricing" className="text-[#E65F2B] hover:underline">查看完整定价方案 →</Link>
        </p>
      </div>
    </section>
  );
}
