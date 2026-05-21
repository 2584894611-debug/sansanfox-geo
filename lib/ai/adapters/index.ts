import { DeepSeekAdapter } from "@/lib/ai/adapters/deepseek";
import { DoubaoAdapter } from "@/lib/ai/adapters/doubao";
import { QwenAdapter } from "@/lib/ai/adapters/qwen";

export const modelAdapters = [new DoubaoAdapter(), new DeepSeekAdapter(), new QwenAdapter()];
