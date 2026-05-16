import { modelAdapters } from "@/lib/ai/adapters";
import { getParser } from "@/lib/ai/parsers";
import { buildScores } from "@/lib/diagnosis/scoring";
import { attachReport, getTask, updateTask } from "@/lib/stores/task-store";
import type { ParsedModelResult } from "@/lib/types";
import { absoluteUrl, sleep } from "@/lib/utils";

export async function runDiagnosisTask(taskId: string) {
  const task = getTask(taskId);
  if (!task) return;

  updateTask(taskId, { status: "RUNNING", progress: 8 });

  try {
    const enabledQuestions = task.questions.filter((question) => question.enabled);
    const primaryQuestion = enabledQuestions[0];
    const modelResults: ParsedModelResult[] = [];

    for (let index = 0; index < modelAdapters.length; index += 1) {
      const adapter = modelAdapters[index];
      const question = primaryQuestion?.text || `${task.brandName}怎么样？`;
      const raw = await adapter.query({
        brandName: task.brandName,
        industry: task.industry,
        question
      });
      const parser = getParser(raw.modelName);
      modelResults.push(
        parser.parse({
          modelName: raw.modelName,
          displayName: raw.displayName,
          raw: raw.raw,
          brandName: task.brandName
        })
      );
      updateTask(taskId, {
        progress: Math.round(12 + ((index + 1) / modelAdapters.length) * 70),
        modelResults: [...modelResults]
      });

      if (!process.env.REDIS_URL) {
        await sleep(450);
      }
    }

    const scoreResult = buildScores(modelResults);
    const completedAt = new Date().toISOString();
    const report = {
      taskId,
      brandName: task.brandName,
      industry: task.industry,
      status: "COMPLETED" as const,
      progress: 100,
      questions: task.questions,
      modelResults,
      shareUrl: absoluteUrl(`/report/${taskId}`),
      createdAt: task.createdAt,
      completedAt,
      ...scoreResult
    };

    attachReport(taskId, report);
    updateTask(taskId, {
      status: "COMPLETED",
      progress: 100,
      modelResults,
      report,
      completedAt
    });
  } catch (error) {
    updateTask(taskId, {
      status: "FAILED",
      progress: 100,
      error: error instanceof Error ? error.message : "诊断任务失败"
    });
  }
}
