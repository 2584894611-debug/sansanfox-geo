"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  RefreshCw,
  Share2,
  TriangleAlert
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HighlightedText } from "@/components/highlighted-text";
import type { DiagnosisReport, ScanTaskRecord } from "@/lib/types";

type ApiState = Partial<ScanTaskRecord> & {
  report?: DiagnosisReport;
  message?: string;
};

export function ReportClient({ taskId }: { taskId: string }) {
  const [state, setState] = useState<ApiState>({ taskId, status: "PENDING", progress: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const response = await fetch(`/api/diagnose/${taskId}`, { cache: "no-store" });
      const data = await response.json();
      if (!cancelled) {
        setState(data);
      }
      if (!cancelled && data.status !== "COMPLETED" && data.status !== "FAILED") {
        window.setTimeout(poll, 1800);
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const report = state.report;
  const radarData = useMemo(
    () =>
      report?.dimensions.map((dimension) => ({
        subject: dimension.label.replace("AI搜索", "AI"),
        品牌: dimension.score,
        行业均值: dimension.industryAvg
      })) ?? [],
    [report]
  );

  async function copyShareUrl() {
    if (!report?.shareUrl) return;
    await navigator.clipboard.writeText(report.shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  if (!report) {
    return (
      <main className="mx-auto min-h-[calc(100vh-64px)] max-w-4xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {state.status === "FAILED" ? (
                <TriangleAlert className="h-5 w-5 text-[#FC8181]" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin text-[#E65F2B]" />
              )}
              {state.status === "FAILED" ? "诊断失败" : "正在生成诊断报告"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress value={state.progress ?? 0} />
            <div className="flex items-center justify-between text-sm text-[#718096]">
              <span>{state.brandName || "品牌"} · 3个模型并行解析</span>
              <span className="font-mono">{state.progress ?? 0}%</span>
            </div>
            {state.error ? <p className="text-sm text-[#B83232]">{state.error}</p> : null}
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="report-watermark relative mx-auto max-w-6xl px-4 py-8">
      <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="orange">开放报告</Badge>
            <Badge variant="blue">Phase 1 MVP</Badge>
            <Badge variant="green">3个模型</Badge>
          </div>
          <h1 className="text-3xl font-bold text-[#1A365D]">{report.brandName} GEO 诊断报告</h1>
          <p className="mt-2 text-sm text-[#718096]">
            {report.industry} · {new Date(report.completedAt || report.createdAt).toLocaleString("zh-CN")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={copyShareUrl}>
            <Copy className="h-4 w-4" />
            {copied ? "已复制" : "复制分享链接"}
          </Button>
          <Button asChild>
            <Link href="/login">
              <Mail className="h-4 w-4" />
              保存到看板
            </Link>
          </Button>
        </div>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>综合评分</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <span className="font-mono text-7xl font-bold text-[#1A365D]">{report.overallScore}</span>
              <div className="pb-3">
                <Badge variant={report.overallScore >= 70 ? "green" : "orange"}>{report.grade}级</Badge>
                <p className="mt-2 text-sm text-[#718096]">按五维度权重计算</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {report.dimensions.map((dimension) => (
                <div key={dimension.key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-[#2D3748]">{dimension.label}</span>
                    <span className="font-mono text-[#1A365D]">{dimension.score}</span>
                  </div>
                  <Progress value={dimension.score} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#E65F2B]" />
              五维度行业均值对比
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[340px] min-w-0">
            <ResponsiveContainer width="100%" height={320} minWidth={240}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#2D3748", fontSize: 12 }} />
                <Tooltip />
                <Radar dataKey="行业均值" stroke="#718096" fill="#718096" fillOpacity={0.12} />
                <Radar dataKey="品牌" stroke="#E65F2B" fill="#E65F2B" fillOpacity={0.24} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        {report.modelResults.map((result) => (
          <Card key={result.modelName}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{result.displayName}</CardTitle>
                <Badge variant={result.mentionStatus === "未提及" ? "red" : "green"}>{result.mentionStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-[#718096]">推荐强度</span>
                  <span className="font-mono text-[#1A365D]">{Math.round(result.mentionStrength * 100)}%</span>
                </div>
                <Progress value={result.mentionStrength * 100} />
              </div>
              <div className="rounded-lg bg-[#F8FAFC] p-3 text-sm leading-6 text-[#2D3748]">
                <HighlightedText text={result.snippets[0] || result.answerText.slice(0, 130)} brandName={report.brandName} />
              </div>
              <div className="flex items-center justify-between text-xs text-[#718096]">
                <span>{result.citations.length} 个引用</span>
                <span>{result.sentiment === "POSITIVE" ? "正面" : result.sentiment === "NEGATIVE" ? "负面" : "中性"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>AI 原文高亮</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.modelResults.map((result) => (
              <details key={`${result.modelName}-raw`} className="rounded-lg border border-[#E2E8F0] bg-white p-4" open>
                <summary className="cursor-pointer font-semibold text-[#1A365D]">{result.displayName}</summary>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#2D3748]">
                  <HighlightedText text={result.answerText} brandName={report.brandName} />
                </p>
                {result.citations.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.citations.slice(0, 3).map((citation, index) => (
                      <Badge key={`${citation.url}-${index}`} variant="default">
                        {citation.title || citation.source || citation.url}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </details>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>监控词条</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {report.questions.map((question) => (
              <div
                key={question.id}
                className="flex items-center justify-between gap-3 rounded-md border border-[#E2E8F0] px-3 py-2 text-sm"
              >
                <span className="truncate">{question.text}</span>
                <Badge variant={question.source === "USER_MANUAL" ? "orange" : "default"}>
                  {question.source === "USER_MANUAL" ? "手动" : "AI"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>持续监控</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-[#F8FAFC] p-3 text-sm text-[#2D3748]">
              <CheckCircle2 className="h-5 w-5 text-[#48BB78]" />
              免费版支持自动触发扫描
            </div>
            <Button asChild className="w-full">
              <Link href="/login">
                <RefreshCw className="h-4 w-4" />
                注册免费版
              </Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={copyShareUrl}>
              <Share2 className="h-4 w-4" />
              分享报告
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
