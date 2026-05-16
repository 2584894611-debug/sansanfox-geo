"use client";

import { Activity, TrendingUp, Bell, Shield, Search, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";

// 功能1：品牌GEO检测 Mockup
function DetectionMockup() {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      {/* 窗口标题栏 */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FC8181]"></div>
          <div className="h-3 w-3 rounded-full bg-[#F6AD55]"></div>
          <div className="h-3 w-3 rounded-full bg-[#68D391]"></div>
        </div>
        <span className="ml-2 text-xs text-[#718096]">品牌GEO检测</span>
      </div>

      {/* 内容区 */}
      <div className="p-5">
        {/* 输入区域 */}
        <div className="mb-4 flex gap-2">
          <div className="flex-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
            <span className="text-sm text-[#4A5568]">输入品牌名</span>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-[#E65F2B] px-3 py-2 text-sm font-medium text-white">
            <Search className="h-4 w-4" />
            检测
          </div>
        </div>

        {/* 评分卡片 */}
        <div className="mb-4 grid grid-cols-4 gap-3">
          <div className="rounded-lg bg-[#E65F2B]/5 p-3 text-center border border-[#E65F2B]/20">
            <div className="text-2xl font-bold text-[#E65F2B]">72</div>
            <div className="text-xs text-[#718096]">GEO总分</div>
          </div>
          <div className="rounded-lg bg-[#48BB78]/10 p-3 text-center border border-[#48BB78]/20">
            <div className="text-2xl font-bold text-[#48BB78]">85</div>
            <div className="text-xs text-[#718096]">推荐率</div>
          </div>
          <div className="rounded-lg bg-[#1A365D]/5 p-3 text-center border border-[#1A365D]/20">
            <div className="text-2xl font-bold text-[#1A365D]">68</div>
            <div className="text-xs text-[#718096]">权威性</div>
          </div>
          <div className="rounded-lg bg-[#ED8936]/10 p-3 text-center border border-[#ED8936]/20">
            <div className="text-2xl font-bold text-[#ED8936]">B</div>
            <div className="text-xs text-[#718096]">等级</div>
          </div>
        </div>

        {/* 平台检测进度 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#4A5568]">豆包</span>
            <span className="flex items-center gap-1 text-[#48BB78]">
              <CheckCircle className="h-3 w-3" /> 已检测
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#4A5568]">DeepSeek</span>
            <span className="flex items-center gap-1 text-[#48BB78]">
              <CheckCircle className="h-3 w-3" /> 已检测
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#4A5568]">通义千问</span>
            <span className="flex items-center gap-1 text-[#48BB78]">
              <CheckCircle className="h-3 w-3" /> 已检测
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 功能2：监控仪表盘 Mockup
function DashboardMockup() {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      {/* 窗口标题栏 */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#FC8181]"></div>
            <div className="h-3 w-3 rounded-full bg-[#F6AD55]"></div>
            <div className="h-3 w-3 rounded-full bg-[#68D391]"></div>
          </div>
          <span className="ml-2 text-xs text-[#718096]">监控仪表盘</span>
        </div>
        <div className="flex gap-1">
          <div className="rounded bg-[#E65F2B] px-2 py-0.5 text-xs text-white">7天</div>
          <div className="rounded bg-gray-200 px-2 py-0.5 text-xs text-[#718096]">30天</div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-5">
        {/* 指标卡片 */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-[#E2E8F0] p-3">
            <div className="text-xs text-[#718096]">GEO总分</div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold text-[#1A365D]">72</span>
              <span className="flex items-center text-xs text-[#48BB78]">
                <TrendingUp className="h-3 w-3" /> +3.2
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-[#E2E8F0] p-3">
            <div className="text-xs text-[#718096]">提及率</div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold text-[#1A365D]">67%</span>
              <span className="flex items-center text-xs text-[#48BB78]">
                <TrendingUp className="h-3 w-3" /> +5%
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-[#E2E8F0] p-3">
            <div className="text-xs text-[#718096]">竞品排名</div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold text-[#1A365D]">#3</span>
              <span className="flex items-center text-xs text-[#48BB78]">
                <TrendingUp className="h-3 w-3" /> +1
              </span>
            </div>
          </div>
        </div>

        {/* 趋势图 */}
        <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-[#1A365D]">分数趋势</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="h-2 w-4 rounded bg-[#E65F2B]"></div>
                <span className="text-xs text-[#718096]">本品</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-4 rounded bg-[#6366F1]"></div>
                <span className="text-xs text-[#718096]">竞品</span>
              </div>
            </div>
          </div>
          {/* 简化的趋势线 */}
          <div className="relative h-20">
            <svg className="h-full w-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              {/* 网格线 */}
              <line x1="0" y1="15" x2="200" y2="15" stroke="#E2E8F0" strokeDasharray="2" />
              <line x1="0" y1="30" x2="200" y2="30" stroke="#E2E8F0" strokeDasharray="2" />
              <line x1="0" y1="45" x2="200" y2="45" stroke="#E2E8F0" strokeDasharray="2" />
              {/* 竞品线 */}
              <polyline
                points="0,35 30,32 60,30 90,28 120,25 150,22 180,18 200,15"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2"
                opacity="0.5"
              />
              {/* 本品线 */}
              <polyline
                points="0,50 30,48 60,45 90,42 120,38 150,35 180,32 200,30"
                fill="none"
                stroke="#E65F2B"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// 功能3：预警通知 Mockup
function AlertMockup() {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      {/* 窗口标题栏 */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#FC8181]"></div>
            <div className="h-3 w-3 rounded-full bg-[#F6AD55]"></div>
            <div className="h-3 w-3 rounded-full bg-[#68D391]"></div>
          </div>
          <span className="ml-2 text-xs text-[#718096]">预警通知</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#FC8181]"></div>
          <span className="text-xs text-[#718096]">3条新消息</span>
        </div>
      </div>

      {/* 内容区 */}
      <div className="divide-y divide-[#E2E8F0]">
        {/* 预警消息1 */}
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FC8181]/10">
                <AlertTriangle className="h-3 w-3 text-[#FC8181]" />
              </div>
              <span className="text-sm font-medium text-[#1A365D]">分数下降预警</span>
            </div>
            <span className="text-xs text-[#A0AEC0]">5月12日</span>
          </div>
          <p className="text-xs text-[#718096]">GEO总分下降6.2%（78→72），Kimi和通义千问未提及品牌</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded bg-[#FC8181]/10 px-2 py-0.5 text-xs text-[#B83232]">需关注</span>
            <span className="text-xs text-[#A0AEC0]">已发送邮件通知</span>
          </div>
        </div>

        {/* 预警消息2 */}
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#48BB78]/10">
                <TrendingUp className="h-3 w-3 text-[#48BB78]" />
              </div>
              <span className="text-sm font-medium text-[#1A365D]">排名上升</span>
            </div>
            <span className="text-xs text-[#A0AEC0]">5月8日</span>
          </div>
          <p className="text-xs text-[#718096]">DeepSeek排名从第3位跃升至第1位</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded bg-[#48BB78]/10 px-2 py-0.5 text-xs text-[#267A4A]">正向变化</span>
          </div>
        </div>

        {/* 预警消息3 */}
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ED8936]/10">
                <Bell className="h-3 w-3 text-[#ED8936]" />
              </div>
              <span className="text-sm font-medium text-[#1A365D]">竞品动态</span>
            </div>
            <span className="text-xs text-[#A0AEC0]">5月1日</span>
          </div>
          <p className="text-xs text-[#718096]">竞品A总分超过本品（75 vs 72）</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded bg-[#ED8936]/10 px-2 py-0.5 text-xs text-[#C05621]">竞品威胁</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureMockups() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* 功能1 */}
      <div className="lg:col-span-1">
        <DetectionMockup />
      </div>
      {/* 功能2 */}
      <div className="lg:col-span-1">
        <DashboardMockup />
      </div>
      {/* 功能3 */}
      <div className="lg:col-span-1">
        <AlertMockup />
      </div>
    </div>
  );
}
