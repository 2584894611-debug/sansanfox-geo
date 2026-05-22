import { NextResponse } from "next/server";
import { z } from "zod";
import { createHmac } from "crypto";
import { normalizeQuestions } from "@/lib/diagnosis/questions";
import { enqueueDiagnosis } from "@/lib/jobs/scan-queue";
import { saveTask } from "@/lib/stores/task-store";

const DiagnoseSchema = z.object({
  brandName: z.string().trim().min(1, "请输入品牌名").max(60, "品牌名不能超过60个字符"),
  industry: z.string().trim().max(40).optional(),
  questions: z.array(z.string().trim().min(1).max(120)).max(10).optional(),
  captchaToken: z.string().min(1, "请先完成滑块验证")
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

// ---- 滑块验证码token校验 ----
const CAPTCHA_SECRET = process.env.TURNSTILE_SECRET_KEY || "sansanfox-captcha-fallback-2026";
const CAPTCHA_TOKEN_MAX_AGE = 5 * 60 * 1000; // 5分钟有效

function verifyCaptchaToken(token: string): { valid: boolean; message?: string } {
  // 格式: nonce.timestamp.signature
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, message: "验证token格式错误" };
  }

  const [nonce, ts, sig] = parts;

  // 验证签名
  const expected = createHmac("sha256", CAPTCHA_SECRET)
    .update(`${nonce}.${ts}`)
    .digest("hex")
    .substring(0, 16);

  if (sig !== expected) {
    return { valid: false, message: "验证失败，请重新验证" };
  }

  // 验证时效性
  const timestamp = parseInt(ts, 36);
  const age = Date.now() - timestamp;
  if (age > CAPTCHA_TOKEN_MAX_AGE || age < 0) {
    return { valid: false, message: "验证已过期，请重新验证" };
  }

  return { valid: true };
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

  // 3. 滑块验证码token校验
  const captchaResult = verifyCaptchaToken(parsed.data.captchaToken);
  if (!captchaResult.valid) {
    return NextResponse.json(
      { message: captchaResult.message || "验证失败，请重新验证" },
      { status: 400 }
    );
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
