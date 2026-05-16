import type { AiModelName } from "@/lib/types";
import { DeepSeekParser } from "@/lib/ai/parsers/deepseek";
import { DoubaoParser } from "@/lib/ai/parsers/doubao";
import { QwenParser } from "@/lib/ai/parsers/qwen";

const parsers = [new DoubaoParser(), new DeepSeekParser(), new QwenParser()];

export function getParser(modelName: AiModelName) {
  const parser = parsers.find((item) => item.modelName === modelName);
  if (!parser) {
    throw new Error(`未找到模型解析器：${modelName}`);
  }
  return parser;
}
