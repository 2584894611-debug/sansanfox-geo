import type { AiModelName, Citation, MentionStatus, ParsedModelResult, Sentiment } from "@/lib/types";

export type ParserInput = {
  modelName: AiModelName;
  displayName: string;
  raw: unknown;
  brandName: string;
};

export interface ModelParser {
  modelName: AiModelName;
  parse(input: ParserInput): ParsedModelResult;
}

export function extractAnswer(raw: unknown) {
  if (!raw || typeof raw !== "object") return "";
  const data = raw as Record<string, any>;
  return (
    data.answer ||
    data.output_text ||
    data.choices?.[0]?.message?.content ||
    data.output?.choices?.[0]?.message?.content?.[0]?.text ||
    data.result ||
    ""
  ).toString();
}

export function extractUrls(text: string): Citation[] {
  const matches = text.match(/https?:\/\/[^\s)）"'<>]+/g) ?? [];
  return [...new Set(matches)].map((url) => ({ url, title: new URL(url).hostname }));
}

export function normalizeCitations(items: unknown): Citation[] {
  if (!Array.isArray(items)) return [];
  return items
    .map<Citation | null>((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, any>;
      return {
        title: record.title || record.name || record.site_name,
        url: record.url || record.link || record.source_url,
        source: record.source || record.site || record.hostname
      };
    })
    .filter((item): item is Citation => Boolean(item && (item.url || item.title)));
}

export function detectMention(answerText: string, brandName: string): {
  mentionStatus: MentionStatus;
  mentionStrength: number;
  snippets: string[];
} {
  const index = answerText.toLowerCase().indexOf(brandName.toLowerCase());
  if (index < 0) {
    return { mentionStatus: "未提及", mentionStrength: 0, snippets: [] };
  }

  const snippet = answerText.slice(Math.max(0, index - 45), Math.min(answerText.length, index + brandName.length + 80));
  const status = /推荐|值得|首选|优先|优势/.test(answerText) ? "主动推荐" : "提及推荐";
  return {
    mentionStatus: status,
    mentionStrength: status === "主动推荐" ? 1 : 0.7,
    snippets: [snippet]
  };
}

export function detectSentiment(answerText: string): Sentiment {
  if (/不足|风险|负面|较弱|缺乏|不建议/.test(answerText)) return "NEGATIVE";
  if (/推荐|优势|清晰|可信|积极|适合|值得/.test(answerText)) return "POSITIVE";
  return "NEUTRAL";
}
