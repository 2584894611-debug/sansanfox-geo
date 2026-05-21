"use client";

import { useState, useMemo } from "react";
import { CaseStudy, industries, grades, getScoreColor, getScoreBgColor, getGradeColor } from "@/content/cases";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, TrendingUp, Building2, ExternalLink, ChevronRight } from "lucide-react";

interface CasesClientProps {
  cases: CaseStudy[];
  stats: {
    totalBrands: number;
    avgScore: number;
    topIssue: string;
    industriesCount: number;
  };
}

export function CasesClient({ cases, stats }: CasesClientProps) {
  const [selectedIndustry, setSelectedIndustry] = useState("全部");
  const [selectedGrade, setSelectedGrade] = useState("全部");

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const industryMatch = selectedIndustry === "全部" || c.industry === selectedIndustry;
      const gradeMatch = selectedGrade === "全部" || c.grade.includes(selectedGrade);
      return industryMatch && gradeMatch;
    });
  }, [cases, selectedIndustry, selectedGrade]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Stats Banner */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.totalBrands}</p>
                <p className="text-sm text-slate-600">已诊断品牌</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{stats.avgScore}</p>
                <p className="text-sm text-slate-600">平均GEO分数</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Target className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700">内容权威性低</p>
                <p className="text-sm text-slate-600">最常见问题</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.industriesCount}</p>
                <p className="text-sm text-slate-600">覆盖行业</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">行业筛选：</span>
              <div className="flex gap-2">
                {industries.map((industry) => (
                  <Button
                    key={industry}
                    variant={selectedIndustry === industry ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIndustry(industry)}
                    className={
                      selectedIndustry === industry
                        ? "bg-[#E65F2B] hover:bg-[#cf5225]"
                        : "border-slate-300 text-slate-700"
                    }
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">评级筛选：</span>
              <div className="flex gap-2">
                {grades.map((grade) => (
                  <Button
                    key={grade}
                    variant={selectedGrade === grade ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGrade(grade)}
                    className={
                      selectedGrade === grade
                        ? "bg-[#1A365D] hover:bg-[#132944]"
                        : "border-slate-300 text-slate-700"
                    }
                  >
                    {grade === "全部" ? "全部" : `${grade}级`}
                  </Button>
                ))}
              </div>
            </div>
            <p className="ml-auto text-sm text-slate-500">
              共 {filteredCases.length} 个案例
            </p>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((c) => (
            <Card
              key={c.id}
              className="group overflow-hidden border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Card Header with Score */}
              <div className={`relative p-6 ${getScoreBgColor(c.geoScore)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{c.brand}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                      <span>{c.industry}</span>
                      <span>•</span>
                      <span>{c.location}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-bold ${getScoreColor(c.geoScore)}`}>
                      {c.geoScore}
                    </p>
                    <Badge className={`mt-1 ${getGradeColor(c.grade)}`}>
                      {c.grade}级
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Top Issue */}
                <div className="mb-4 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    核心问题
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{c.topIssue}</p>
                </div>

                {/* Strengths */}
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    优势标签
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.strengths.slice(0, 3).map((s, i) => (
                      <Badge
                        key={i}
                        variant="green"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metrics Preview */}
                <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-slate-50 p-2">
                    <span className="text-slate-500">AI搜索率</span>
                    <span className="ml-2 font-semibold text-slate-700">{c.aiSearchRate}%</span>
                  </div>
                  <div className="rounded bg-slate-50 p-2">
                    <span className="text-slate-500">品牌完整度</span>
                    <span className="ml-2 font-semibold text-slate-700">{c.brandCompleteness}%</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant="outline"
                  className="group/btn w-full border-[#E65F2B] text-[#E65F2B] hover:bg-[#E65F2B] hover:text-white"
                >
                  查看完整报告
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-slate-500">暂无符合条件的案例</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#1A1A2E] to-[#16213E] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">你的品牌GEO分数是多少？</h2>
          <p className="mt-4 text-lg text-slate-300">
            获得专业的AI搜索品牌健康度诊断，发现优化机会
          </p>
          <Button
            size="lg"
            className="mt-8 bg-[#E65F2B] text-white hover:bg-[#cf5225]"
            asChild
          >
            <a href="/#diagnose">
              立即免费诊断
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
