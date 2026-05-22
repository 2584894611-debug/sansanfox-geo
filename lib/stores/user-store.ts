import bcrypt from "bcryptjs";
import type { RegisterUserInput } from "@/lib/types";

type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  createdAt: string;
};

const globalForUsers = globalThis as unknown as {
  sansanfoxUsers?: Map<string, StoredUser>;
};

const users = globalForUsers.sansanfoxUsers ?? new Map<string, StoredUser>();

if (!globalForUsers.sansanfoxUsers) {
  globalForUsers.sansanfoxUsers = users;
}

export async function registerUser(input: RegisterUserInput) {
  const email = input.email.trim().toLowerCase();
  if (users.has(email)) {
    throw new Error("该邮箱已注册");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    passwordHash,
    plan: "FREE",
    createdAt: new Date().toISOString()
  };

  users.set(email, user);
  return { id: user.id, email: user.email, plan: user.plan };
}

export async function verifyUser(emailInput: string, password: string) {
  const email = emailInput.trim().toLowerCase();
  const user = users.get(email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, email: user.email, plan: user.plan };
}
