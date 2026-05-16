import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-[#EDF2F7] text-[#1A365D]",
  orange: "bg-[#E65F2B]/10 text-[#B7441B]",
  green: "bg-[#48BB78]/12 text-[#267A4A]",
  red: "bg-[#FC8181]/15 text-[#B83232]",
  blue: "bg-[#1A365D]/10 text-[#1A365D]"
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
