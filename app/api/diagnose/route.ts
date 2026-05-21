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

// ---- IP限频 ----
const ipRequestMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 1;
const MAX_REQUESTS_PER_DAY = 5;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const minuteMs = 60 * 1000;

  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetAt) {
    // 新的1天窗口
    ipRequestMap.set(ip, { count: 1, resetAt: now + dayMs });
    return { allowed: true };
  }

  // 检查每日上限
  if (record.count >= MAX_REQUESTS_PER_DAY) {
    const hoursLeft = Math.ceil((record.resetAt - now) / (60 * 60 * 1000));
    return { allowed: false, message: `今日诊断次数已用完，请${hoursLeft}小时后再试` };
  }

  record.count++;
  return { allowed: true };
}

// 定期清理过期记录，防止内存泄漏
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRequestMap) {
      if (now > record.resetAt) ipRequestMap.delete(ip);
    }
  }, 60 * 60 * 1000); // 每小时清理一次
}

export async function POST(request: Request) {
  // 1. IP限频检查
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(clientIp);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { message: rateLimitResult.message || "请求过于频繁，请稍后再试" },
      { status: 429 }
    );
  }

  // 2. 参数校验
  const body = await request.json().catch(() => null);
  const parsed = DiagnoseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "参数错误" },
      { status: 400 }
    );
  }

  // 3. 创建诊断任务
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
