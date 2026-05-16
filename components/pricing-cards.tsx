"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PricingPlan = {
  code: "FREE" | "PRO" | "ENTERPRISE";
  name: string;
  price: string;
  badge: string;
  featured?: boolean;
  features: string[];
};

const plans: PricingPlan[] = [
  {
    code: "FREE",
    name: "免费版",
    price: "¥0",
    badge: "自动触发",
    features: ["1个品牌", "10个监控词条", "系统默认自动扫描", "30天历史数据", "开放诊断报告"]
  },
  {
    code: "PRO",
    name: "专业版",
    price: "¥399/月",
    badge: "模拟支付",
    featured: true,
    features: ["3个品牌", "50个监控词条", "每日自动扫描", "全部历史数据", "竞品对比"]
  },
  {
    code: "ENTERPRISE",
    name: "企业版",
    price: "¥2,999+",
    badge: "联系我们",
    features: ["无限品牌", "500个监控词条", "每日+自定义Cron", "白标报告", "API接口预留"]
  }
];

export function PricingCards({ compact = false }: { compact?: boolean }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function checkout(plan: string) {
    setLoadingPlan(plan);
    setMessage("");
    const response = await fetch("/api/pricing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    });
    const data = await response.json();
    setMessage(data.message || "已处理");
    setLoadingPlan(null);
  }

  return (
    <div>
      <div className={`grid gap-4 ${compact ? "md:grid-cols-1 xl:grid-cols-3" : "md:grid-cols-3"}`}>
        {plans.map((plan) => (
          <Card
            key={plan.code}
            className={plan.featured ? "border-[#E65F2B] shadow-md" : undefined}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{plan.name}</CardTitle>
                <Badge variant={plan.featured ? "orange" : "default"}>{plan.badge}</Badge>
              </div>
              <div className="pt-3 font-mono text-3xl font-bold text-[#1A365D]">{plan.price}</div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-[#2D3748]">
                    <Check className="h-4 w-4 text-[#48BB78]" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button
                className="w-full"
                variant={plan.featured ? "default" : "outline"}
                onClick={() => checkout(plan.code)}
                disabled={loadingPlan === plan.code}
              >
                {loadingPlan === plan.code ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {plan.code === "ENTERPRISE" ? "提交意向" : "选择套餐"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {message ? <p className="mt-4 text-sm font-medium text-[#1A365D]">{message}</p> : null}
    </div>
  );
}
