import { NextResponse } from "next/server";
import { z } from "zod";

const CheckoutSchema = z.object({
  plan: z.enum(["FREE", "PRO", "ENTERPRISE"])
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "套餐参数错误" }, { status: 400 });
  }

  return NextResponse.json({
    plan: parsed.data.plan,
    status: parsed.data.plan === "FREE" ? "ACTIVE" : "SIMULATED_PAID",
    message:
      parsed.data.plan === "FREE"
        ? "免费版已启用"
        : "MVP模拟支付成功，真实微信/支付宝回调接口将在后续接入"
  });
}
