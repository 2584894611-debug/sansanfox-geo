import type { AiModelName } from "@/lib/types";

export type ModelRequest = {
  brandName: string;
  industry?: string;
  question: string;
};

export type ModelRawResponse = {
  modelName: AiModelName;
  displayName: string;
  raw: unknown;
};

export interface ModelAdapter {
  modelName: AiModelName;
  displayName: string;
  query(request: ModelRequest): Promise<ModelRawResponse>;
}

export function buildSearchPrompt({ question }: ModelRequest) {
  return `请根据最新的网络信息回答以下问题，并在回答中注明引用来源（包括网页链接）。问题：${question}`;
}
