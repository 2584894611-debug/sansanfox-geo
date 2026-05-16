import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function gradeFromScore(score: number) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

export function highlightBrand(text: string, brandName: string) {
  const escaped = brandName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}
