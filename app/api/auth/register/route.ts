import { NextResponse } from "next/server";
import { z } from "zod";
import { registerUser } from "@/lib/stores/user-store";

const RegisterSchema = z.object({
  email: z.email("请输入有效邮箱"),
  password: z.string().min(8, "密码至少8位")
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "注册参数错误" },
      { status: 400 }
    );
  }

  try {
    const user = await registerUser(parsed.data);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "注册失败" },
      { status: 400 }
    );
  }
}
