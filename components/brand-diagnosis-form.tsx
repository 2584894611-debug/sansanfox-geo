"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateMonitoringQuestions } from "@/lib/diagnosis/questions";

export function BrandDiagnosisForm() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("GEO优化");
  const [manualQuestions, setManualQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generatedQuestions = useMemo(
    () => generateMonitoringQuestions(brandName || "你的品牌", industry || "GEO优化"),
    [brandName, industry]
  );
  const activeQuestions = [...manualQuestions, ...generatedQuestions.map((question) => question.text)].slice(0, 10);

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
        body: JSON.stringify({
          brandName,
          industry,
          questions: manualQuestions
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "诊断启动失败");
      }
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_auto]">
            <Input
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              placeholder="输入品牌名，例如：三三狐"
              maxLength={60}
              required
            />
            <Input
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              placeholder="行业，例如：GEO优化"
              maxLength={40}
            />
            <Button type="submit" size="lg" disabled={loading || !brandName.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              立即诊断
            </Button>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#1A365D]">监控词条</span>
              <span className="font-mono text-xs text-[#718096]">{activeQuestions.length}/10</span>
            </div>
            <div className="mb-3 grid gap-2 md:grid-cols-[1fr_auto]">
              <Input
                value={newQuestion}
                onChange={(event) => setNewQuestion(event.target.value)}
                placeholder="手动添加一个诊断问题"
                maxLength={120}
              />
              <Button type="button" variant="outline" onClick={addQuestion}>
                <Plus className="h-4 w-4" />
                添加
              </Button>
            </div>
            <div className="grid gap-2">
              {activeQuestions.map((question, index) => {
                const isManual = manualQuestions.includes(question);
                return (
                  <div
                    key={`${question}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 flex-1 truncate text-[#2D3748]">{question}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={isManual ? "orange" : "default"}>{isManual ? "手动" : "AI"}</Badge>
                      {isManual ? (
                        <button
                          type="button"
                          className="rounded p-1 text-[#718096] hover:bg-[#EDF2F7] hover:text-[#1A365D]"
                          onClick={() =>
                            setManualQuestions((current) => current.filter((item) => item !== question))
                          }
                          aria-label="删除词条"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {error ? <p className="text-sm font-medium text-[#B83232]">{error}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
