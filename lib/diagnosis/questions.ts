import type { MonitoringQuestion } from "@/lib/types";

const templates = [
  "{brand}怎么样？有哪些核心优势？",
  "{brand}适合哪些用户或业务场景？",
  "{industry}领域有哪些值得关注的品牌？请说明理由。",
  "{brand}和同类品牌相比有什么差异化？",
  "如果要选择{industry}服务，{brand}是否值得推荐？",
  "{brand}的官网、产品或服务信息是否清晰可信？"
];

export function generateMonitoringQuestions(
  brandName: string,
  industry = "GEO优化"
): MonitoringQuestion[] {
  return templates.slice(0, 6).map((template) => ({
    id: crypto.randomUUID(),
    text: template.replaceAll("{brand}", brandName).replaceAll("{industry}", industry),
    source: "AI_GENERATED",
    enabled: true
  }));
}

export function normalizeQuestions(
  brandName: string,
  industry: string | undefined,
  inputQuestions?: string[]
) {
  const generated = generateMonitoringQuestions(brandName, industry);
  const manual =
    inputQuestions
      ?.map((text) => text.trim())
      .filter(Boolean)
      .slice(0, 10)
      .map((text) => ({
        id: crypto.randomUUID(),
        text,
        source: "USER_MANUAL" as const,
        enabled: true
      })) ?? [];

  const merged = [...manual, ...generated].reduce<MonitoringQuestion[]>((acc, question) => {
    if (!acc.some((item) => item.text === question.text)) {
      acc.push(question);
    }
    return acc;
  }, []);

  return merged.slice(0, 10);
}
