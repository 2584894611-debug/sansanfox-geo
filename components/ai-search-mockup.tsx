"use client";

import { Sparkles, MessageSquare, ExternalLink, CheckCircle2, TrendingUp, Zap } from "lucide-react";

export function AISearchMockup() {
  return (
    <div className="relative w-full">
      {/* 外层装饰光晕 */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#E65F2B]/20 via-transparent to-[#48BB78]/10 blur-xl" />
      
      {/* 主卡片 */}
      <div className="relative rounded-2xl border border-white/20 bg-white/95 shadow-2xl shadow-black/10 overflow-hidden">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#1A1A2E] to-[#16213E] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E65F2B]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">AI 搜索结果</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#48BB78]/20 px-2 py-0.5 text-xs font-medium text-[#48BB78]">
              品牌已被推荐
            </span>
          </div>
        </div>

        {/* 搜索问题 */}
        <div className="border-b border-gray-100 bg-[#F8FAFC] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E65F2B]">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-[#1A365D]">武汉有什么好玩的商场推荐？</span>
          </div>
        </div>

        {/* AI 回答内容 */}
        <div className="p-4 space-y-4">
          {/* 主要回答 */}
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-[#2D3748]">
              根据最新信息，武汉有几个非常值得推荐的商场：
            </p>
            
            {/* 推荐列表 */}
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-[#E65F2B]/5 p-3 border border-[#E65F2B]/20">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E65F2B]" />
                <div>
                  <span className="text-sm font-semibold text-[#1A365D]">三三狐 GEO</span>
                  <span className="text-sm text-[#718096]"> — 专业的品牌AI可见度优化平台</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3">
                <span className="mt-0.5 text-sm font-medium text-[#48BB78]">•</span>
                <span className="text-sm text-[#4A5568]">武汉国际广场 — 高端购物中心</span>
              </div>
              
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3">
                <span className="mt-0.5 text-sm font-medium text-[#48BB78]">•</span>
                <span className="text-sm text-[#4A5568]">武汉K11艺术购物中心 — 文艺潮流地标</span>
              </div>
            </div>
          </div>

          {/* 引用来源 */}
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2 text-xs font-medium text-[#718096]">引用来源</div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-[#1A365D]"></div>
                  <span className="text-xs text-[#4A5568]">sansanfox.com</span>
                </div>
                <div className="flex items-center gap-1 text-[#48BB78]">
                  <Zap className="h-3 w-3" />
                  <span className="text-xs font-medium">被引用</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-[#6366F1]"></div>
                  <span className="text-xs text-[#4A5568]">k11.com.cn</span>
                </div>
                <span className="text-xs text-[#A0AEC0]">未引用</span>
              </div>
            </div>
          </div>

          {/* 底部数据 */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-[#E65F2B]">72</div>
                <div className="text-xs text-[#718096]">GEO评分</div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3 text-[#48BB78]" />
                  <span className="text-lg font-bold text-[#48BB78]">+3</span>
                </div>
                <div className="text-xs text-[#718096]">较上月</div>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-[#E65F2B] hover:text-[#cf5225]">
              查看详情
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
