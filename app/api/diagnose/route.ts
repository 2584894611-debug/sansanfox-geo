import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeQuestions } from "@/lib/diagnosis/questions";
import { enqueueDiagnosis } from "@/lib/jobs/scan-queue";
import { saveTask } from "@/lib/stores/task-store";

const DiagnoseSchema = z.object({
  brandName: z.string().trim().min(1, "请输入品牌名").max(60, "品牌名不能超过60个字符"),
  industry: z.string().trim().max(40).optional(),
  questions: z.array(z.string().trim().min(1).max(120)).max(10).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = DiagnoseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "参数错误" },
      { status: 400 }
    );
  }

  const taskId = crypto.randomUUID();
  const shareSlug = crypto.randomUUID().slice(0, 8);
  const questions = normalizeQuestions(parsed.data.brandName, parsed.data.industry, parsed.data.questions);

  saveTask({
    taskId,
    brandName: parsed.data.brandName,
    industry: parsed.data.industry || "GEO优化",
    status: "PENDING",
    progress: 0,
    questions,
    modelResults: [],
    shareSlug,
    createdAt: new Date().toISOString()
  });

  await enqueueDiagnosis(taskId);

  return NextResponse.json({
    taskId,
    status: "PENDING",
    progress: 0,
    reportUrl: `/report/${taskId}`
  });
}
