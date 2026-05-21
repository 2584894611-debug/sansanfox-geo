import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeQuestions } from "@/lib/diagnosis/questions";
import { enqueueDiagnosis } from "@/lib/jobs/scan-queue";
import { saveTask } from "@/lib/stores/task-store";

const DiagnoseSchema = z.object({
  brandName: z.string().trim().min(1, "请输入品牌名").max(60, "品牌名不能超过60个字符"),
  industry: z.string().trim().max(40).optional(),
  questions: z.array(z.string().trim().min(1).max(120)).max(10).optional(),
  captchaToken: z.string().optional()
});

// ---- IP限频 ----
const ipRequestMap = new Map<string, { count: number; resetAt: number }>();
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

  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + dayMs });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_DAY) {
    const hoursLeft = Math.ceil((record.resetAt - now) / (60 * 60 * 1000));
    return { allowed: false, message: `今日诊断次数已用完，请${hoursLeft}小时后再试` };
  }

  record.count++;
  return { allowed: true };
}

// 定期清理过期记录
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRequestMap) {
      if (now > record.resetAt) ipRequestMap.delete(ip);
    }
  }, 60 * 60 * 1000);
}

// ---- Turnstile验证 ----
async function verifyTurnstile(token: string, clientIp: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    // 没配Secret Key时跳过验证（开发环境）
    console.warn("TURNSTILE_SECRET_KEY not configured, skipping captcha verification");
    return true;
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: clientIp
      })
    });
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
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

  // 3. 验证码校验（配置了Turnstile时必须通过）
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (turnstileSiteKey) {
    const captchaToken = parsed.data.captchaToken;
    if (!captchaToken) {
      return NextResponse.json(
        { message: "请先完成人机验证" },
        { status: 400 }
      );
    }
    const isValid = await verifyTurnstile(captchaToken, clientIp);
    if (!isValid) {
      return NextResponse.json(
        { message: "人机验证失败，请重新验证" },
        { status: 400 }
      );
    }
  }

  // 4. 创建诊断任务
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
