import { NextResponse } from "next/server";
import { createHmac, randomBytes } from "crypto";

// 复用TURNSTILE_SECRET_KEY环境变量作为签名密钥
const CAPTCHA_SECRET = process.env.TURNSTILE_SECRET_KEY || "sansanfox-captcha-fallback-2026";

/**
 * 生成服务端签名token
 * 格式: nonce.timestamp.signature
 * 5分钟有效
 */
function generateCaptchaToken(): string {
  const nonce = randomBytes(8).toString("hex");
  const ts = Date.now().toString(36);
  const sig = createHmac("sha256", CAPTCHA_SECRET)
    .update(`${nonce}.${ts}`)
    .digest("hex")
    .substring(0, 16);
  return `${nonce}.${ts}.${sig}`;
}

export async function POST() {
  const token = generateCaptchaToken();
  return NextResponse.json({ token });
}
