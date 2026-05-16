"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Search, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateMonitoringQuestions } from "@/lib/diagnosis/questions";
import { industries } from "@/lib/industry-data";

export function BrandDiagnosisForm() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSubIndustry, setSelectedSubIndustry] = useState("");
  const [industryOpen, setIndustryOpen] = useState(false);
  const [subIndustryOpen, setSubIndustryOpen] = useState(false);
  const [manualQuestions, setManualQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentIndustry = industries.find((i) => i.name === selectedIndustry);
  const subIndustries = currentIndustry?.children ?? [];
  const displayIndustry = selectedSubIndustry || selectedIndustry || "GEO优化";

  const generatedQuestions = useMemo(
    () => generateMonitoringQuestions(brandName || "你的品牌", displayIndustry),
    [brandName, displayIndustry]
  );
  const activeQuestions = [...manualQuestions, ...generatedQuestions.map((q) => q.text)].slice(0, 10);

  function addQuestion() {
    const value = newQuestion.trim();
    if (!value || manualQuestions.includes(value)) return;
    setManualQuestions((current) => [value, ...current].slice(0, 10));
    setNewQuestion("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, industry: displayIndustry, questions: manualQuestions })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "诊断启动失败");
      router.push(`/report/${data.taskId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "诊断启动失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="border-b border-[#E2E8F0]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl">品牌 GEO 诊断</CardTitle>
            <p className="mt-2 text-sm text-[#718096]">无需注册，提交后生成全开放报告</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="orange">豆包</Badge>
            <Badge variant="blue">DeepSeek</Badge>
            <Badge variant="green">通义千问</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 第一行：品牌名 + 立即诊断 */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="输入品牌名，例如：三三狐" maxLength={60} required />
            </div>
            <Button type="submit" size="lg" disabled={loading || !brandName.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              立即诊断
            </Button>
          </div>

          {/* 第二行：行业 + 子类，各占50% */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <button type="button" onClick={() => { setIndustryOpen(!industryOpen); setSubIndustryOpen(false); }}
                className="flex h-11 w-full items-center justify-between rounded-[6px] border border-[#CBD5E0] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#E65F2B] focus:ring-2 focus:ring-[#E65F2B]/15">
                <span className={selectedIndustry ? "text-[#2D3748]" : "text-[#A0AEC0]"}>{selectedIndustry || "选择行业"}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[#718096]" />
              </button>
              {industryOpen && (
                <div className="absolute z-20 mt-1 w-full overflow-y-auto rounded-lg border border-[#E2E8F0] bg-white shadow-lg" style={{ maxHeight: 280 }}>
                  {industries.map((ind) => (
                    <button key={ind.name} type="button"
                      className={`w-full px-3 py-2.5 text-left text-sm transition ${selectedIndustry === ind.name ? "bg-[#FFF5EB] font-semibold text-[#E65F2B]" : "text-[#2D3748] hover:bg-[#FFF5EB]"}`}
                      onClick={() => { setSelectedIndustry(ind.name); setSelectedSubIndustry(""); setIndustryOpen(false); setSubIndustryOpen(true); }}>
                      {ind.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button type="button" onClick={() => subIndustries.length > 0 && setSubIndustryOpen(!subIndustryOpen)}
                className={`flex h-11 w-full items-center justify-between rounded-[6px] px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#E65F2B]/15 ${subIndustries.length > 0 ? "border border-[#E65F2B]/40 bg-[#FFF5EB] focus:border-[#E65F2B]" : "border border-[#E2E8F0] bg-[#F8FAFC] cursor-not-allowed"}`}>
                <span className={selectedSubIndustry ? "text-[#2D3748]" : subIndustries.length > 0 ? "text-[#A0AEC0]" : "text-[#CBD5E0]"}>{subIndustries.length > 0 ? (selectedSubIndustry || "选择子类（可选）") : "请先选择行业"}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[#718096]" />
              </button>
              {subIndustryOpen && subIndustries.length > 0 && (
                <div className="absolute z-20 mt-1 w-full overflow-y-auto rounded-lg border border-[#E2E8F0] bg-white shadow-lg" style={{ maxHeight: 220 }}>
                  <button type="button" className="w-full px-3 py-2.5 text-left text-sm text-[#718096] hover:bg-[#EDF2F7]" onClick={() => { setSelectedSubIndustry(""); setSubIndustryOpen(false); }}>不选择子类</button>
                  {subIndustries.map((sub) => (
                    <button key={sub} type="button"
                      className={`w-full px-3 py-2.5 text-left text-sm transition ${selectedSubIndustry === sub ? "bg-[#FFF5EB] font-semibold text-[#E65F2B]" : "text-[#2D3748] hover:bg-[#FFF5EB]"}`}
                      onClick={() => { setSelectedSubIndustry(sub); setSubIndustryOpen(false); }}>
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#1A365D]">监控词条</span>
              <span className="font-mono text-xs text-[#718096]">{activeQuestions.length}/10</span>
            </div>
            <div className="mb-3 grid gap-2 md:grid-cols-[1fr_auto]">
              <Input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="手动添加一个诊断问题" maxLength={120} />
              <Button type="button" variant="outline" onClick={addQuestion}><Plus className="h-4 w-4" />添加</Button>
            </div>
            <div className="grid gap-2">
              {activeQuestions.map((question, index) => {
                const isManual = manualQuestions.includes(question);
                return (
                  <div key={`${question}-${index}`} className="flex items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm">
                    <span className="min-w-0 flex-1 truncate text-[#2D3748]">{question}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={isManual ? "orange" : "default"}>{isManual ? "手动" : "AI"}</Badge>
                      {isManual && (
                        <button type="button" className="rounded p-1 text-[#718096] hover:bg-[#EDF2F7] hover:text-[#1A365D]" onClick={() => setManualQuestions((c) => c.filter((item) => item !== question))} aria-label="删除词条"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm font-medium text-[#B83232]">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
