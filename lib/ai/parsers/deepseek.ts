import {
  detectMention,
  detectSentiment,
  extractAnswer,
  extractUrls,
  normalizeCitations,
  type ModelParser,
  type ParserInput
} from "@/lib/ai/parsers/base";

export class DeepSeekParser implements ModelParser {
  modelName = "DEEPSEEK" as const;

  parse(input: ParserInput) {
    const raw = input.raw as Record<string, any>;
    const answerText = extractAnswer(input.raw);
    const citations = [
      ...normalizeCitations(raw.search_results),
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
