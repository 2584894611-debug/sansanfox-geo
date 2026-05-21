import {
  detectMention,
  detectSentiment,
  extractAnswer,
  extractUrls,
  normalizeCitations,
  type ModelParser,
  type ParserInput
} from "@/lib/ai/parsers/base";

export class QwenParser implements ModelParser {
  modelName = "QWEN" as const;

  parse(input: ParserInput) {
    const raw = input.raw as Record<string, any>;
    const answerText = extractAnswer(input.raw);
    const citations = [
      ...normalizeCitations(raw.doc_references),
      ...extractUrls(answerText)
    ];
    const mention = detectMention(answerText, input.brandName);

    return {
      modelName: input.modelName,
      displayName: input.displayName,
      answerText,
      citations,
      sentiment: detectSentiment(answerText),
      rawResponse: input.raw,
      ...mention
    };
  }
}
