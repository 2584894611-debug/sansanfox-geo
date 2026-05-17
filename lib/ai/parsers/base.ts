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

/**
 * 判断AI是否正确识别了品牌（回答相关性）
 */
function detectBrandRecognition(answerText: string, brandName: string): {
  recognized: boolean;
  confidence: number;
} {
  const lower = answerText.toLowerCase();
  const brandLower = brandName.toLowerCase();

  if (!lower.includes(brandLower)) {
    return { recognized: false, confidence: 0 };
  }

  // 强否定：AI否认品牌存在
  const denialPatterns = [
    /没有.*?(?:知名|权威|公认|主流).*?(?:品牌|企业|实体)/,
    /不具(?:备|有).*?(?:市场|品牌|商业).*(?:地位|影响力)/,
    /无法.*?(?:确认|总结|客观).*(?:品牌|核心|存在)/,
    /不存在.*?(?:公认|知名|权威).*(?:品牌|企业)/,
    /未发现.*?(?:具备|具有).*(?:影响力|知名度)/,
    /并非.*?(?:品牌|企业|公司)/,
    /无法客观总结/,
    /请提供更具体/,
  ];

  if (denialPatterns.some(p => p.test(answerText))) {
    return { recognized: false, confidence: 0.15 };
  }

  // 弱否定：AI不确定但尝试回答
  const weakPatterns = [
    /可能指代.*?多个/,
    /信息.*?有限/,
    /无法确定.*?具体/,
    /由于.*?未明确/,
  ];

  if (weakPatterns.some(p => p.test(answerText))) {
    const hasBrandDetail = /(?:门店|服务|产品|菜品|口碑|特色|优势|官网|成立|连锁)/.test(answerText);
    return { recognized: hasBrandDetail, confidence: hasBrandDetail ? 0.7 : 0.35 };
  }

  return { recognized: true, confidence: 1.0 };
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
  const recognition = detectBrandRecognition(answerText, brandName);

  // 品牌未被正确识别 → 大幅降级
  if (!recognition.recognized) {
    return {
      mentionStatus: "提及推荐",
      mentionStrength: 0.15,
      snippets: [snippet]
    };
  }

  // 弱识别
  if (recognition.confidence < 0.8) {
    const status: MentionStatus = /推荐|值得|首选|优先|优势/.test(answerText) ? "主动推荐" : "提及推荐";
    return {
      mentionStatus: status,
      mentionStrength: status === "主动推荐" ? 0.6 : 0.4,
      snippets: [snippet]
    };
  }

  // 正常识别
  const status = /推荐|值得|首选|优先|优势/.test(answerText) ? "主动推荐" : "提及推荐";
  return {
    mentionStatus: status,
    mentionStrength: status === "主动推荐" ? 1 : 0.7,
    snippets: [snippet]
  };
}

export function detectSentiment(answerText: string): Sentiment {
  // 强否定：AI否认品牌存在
  if (
    /没有.*?(?:权威|知名|公认|主流).*(?:品牌|实体|企业)/.test(answerText) ||
    /不具(?:备|有).*(?:市场|品牌).*(?:地位|影响力)/.test(answerText) ||
    /无法客观总结/.test(answerText) ||
    /并非.*?(?:品牌|企业|公司)/.test(answerText) ||
    /无法.*?(?:确认|核实).*(?:品牌|存在)/.test(answerText)
  ) {
    return "NEGATIVE";
  }

  if (/不足|风险|负面|较弱|缺乏|不建议|较差|问题|投诉|差评|隐患|缺陷/.test(answerText)) return "NEGATIVE";
  if (/推荐|优势|清晰|可信|积极|适合|值得|认可|好评|稳定/.test(answerText)) return "POSITIVE";
  return "NEUTRAL";
}
