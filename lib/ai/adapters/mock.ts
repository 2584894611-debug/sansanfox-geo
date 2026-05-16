import type { AiModelName } from "@/lib/types";

export function mockResponse(modelName: AiModelName, displayName: string, brandName: string, question: string) {
  const profiles: Record<AiModelName, string> = {
    DOUBAO: "在品牌可见度和内容结构上表现较积极，适合先从官网结构化内容与问答型页面补强。",
    DEEPSEEK: "品牌信息有一定辨识度，但权威引用仍需增加，建议补充案例、媒体报道与行业词页面。",
    QWEN: "整体推荐倾向中性偏正面，如果持续输出围绕核心场景的内容，更容易被AI回答引用。"
  };

  return {
    id: crypto.randomUUID(),
    answer: `${brandName}在“${question}”这个问题下被提及。${profiles[modelName]} 从GEO诊断角度看，${brandName}需要让品牌定位、目标用户、服务边界和可信来源更容易被模型识别。`,
    references: [
      {
        title: `${brandName}官网`,
        url: `https://www.example.com/${encodeURIComponent(brandName)}`
      },
      {
        title: "行业观察",
        url: "https://www.example.com/geo-research"
      }
    ],
    search_results: [
      {
        title: `${brandName}介绍`,
        url: `https://search.example.com/${encodeURIComponent(brandName)}`
      }
    ],
    doc_references: [
      {
        title: `${displayName}来源摘要`,
        url: "https://docs.example.com/source"
      }
    ],
    sentiment: "POSITIVE",
    mock: true
  };
}
