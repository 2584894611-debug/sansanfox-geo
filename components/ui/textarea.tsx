import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "min-h-24 w-full rounded-[6px] border border-[#CBD5E0] bg-white px-3 py-2 text-sm text-[#2D3748] outline-none transition focus:border-[#E65F2B] focus:ring-2 focus:ring-[#E65F2B]/15 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
