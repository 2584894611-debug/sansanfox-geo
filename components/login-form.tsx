"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "register") {
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const registerData = await registerResponse.json();
        if (!registerResponse.ok) {
          throw new Error(registerData.message || "注册失败");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        throw new Error("邮箱或密码不正确");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "操作失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{mode === "register" ? "注册免费版" : "邮箱登录"}</CardTitle>
          <Badge variant="green">FREE</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="邮箱"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="密码至少8位"
            minLength={8}
            required
          />
          {message ? <p className="text-sm font-medium text-[#B83232]">{message}</p> : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "register" ? (
              <UserPlus className="h-4 w-4" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {mode === "register" ? "注册并登录" : "登录"}
          </Button>
          <Button
            className="w-full"
            variant="ghost"
            type="button"
            onClick={() => {
              setMode(mode === "register" ? "login" : "register");
              setMessage("");
            }}
          >
            {mode === "register" ? "已有账号，去登录" : "没有账号，注册免费版"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
