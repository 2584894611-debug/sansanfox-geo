import type { DimensionScore, ParsedModelResult } from "@/lib/types";
import { clamp, gradeFromScore } from "@/lib/utils";

const industryAvg = {
  searchRecommendScore: 58,
  infoCompletenessScore: 62,
  authorityScore: 55,
  differentiationScore: 52,
  structuredDataScore: 48
};

export function buildScores(results: ParsedModelResult[]) {
  const mentioned = results.filter((result) => result.mentionStatus !== "未提及");
  const positiveResults = results.filter((result) => result.sentiment === "POSITIVE");
  const negativeResults = results.filter((result) => result.sentiment === "NEGATIVE");
  const neutralResults = results.filter((result) => result.sentiment === "NEUTRAL");

  const avgStrength =
    results.reduce((sum, result) => sum + result.mentionStrength, 0) / Math.max(results.length, 1);
  const positiveCount = positiveResults.length;
  const negativeCount = negativeResults.length;
  const citationCount = results.reduce((sum, result) => sum + result.citations.length, 0);
  const textRichness = results.reduce((sum, result) => sum + Math.min(result.answerText.length / 9, 100), 0) / Math.max(results.length, 1);

  // AI搜索推荐率：基于有效提及（正面+中性），负面不算推荐
  const effectiveMentionRate = (positiveCount + neutralResults.length * 0.5) / Math.max(results.length, 1);
  const searchRecommendScore = clamp(effectiveMentionRate * 55 + avgStrength * 45 - negativeCount * 12);

  // 品牌信息完整度：正面回答贡献更多，负面打折
  const infoCompletenessScore = clamp(
    textRichness * 0.35 +
    positiveCount * 14 +
    neutralResults.length * 8 +
    negativeCount * 2 -  // 负面回答信息完整度极低
    negativeCount * 10
  );

  // 内容权威性：正面+引用=权威，负面不权威
  const authorityScore = clamp(
    positiveCount * 16 +
    citationCount * 8 +
    avgStrength * 35 -
    negativeCount * 18
  );

  // 差异化特征表达：只有正面回答才算表达了差异
  const differentiationScore = clamp(
    positiveResults.filter((result) => /差异|优势|特色|适合|推荐|定位/.test(result.answerText)).length * 28 +
    avgStrength * 25 -
    negativeCount * 15
  );

  // 结构化数据覆盖
  const structuredDataScore = clamp(
    citationCount * 8 +
    (results.length - negativeCount) * 14 +
    22 -
    negativeCount * 10
  );

  const dimensions: DimensionScore[] = [
    {
      key: "searchRecommendScore",
      label: "AI搜索推荐率",
      score: Math.round(searchRecommendScore),
      industryAvg: industryAvg.searchRecommendScore,
      weight: 25
    },
    {
      key: "infoCompletenessScore",
      label: "品牌信息完整度",
      score: Math.round(infoCompletenessScore),
      industryAvg: industryAvg.infoCompletenessScore,
      weight: 20
    },
    {
      key: "authorityScore",
      label: "内容权威性",
      score: Math.round(authorityScore),
      industryAvg: industryAvg.authorityScore,
      weight: 25
    },
    {
      key: "differentiationScore",
      label: "差异化特征表达",
      score: Math.round(differentiationScore),
      industryAvg: industryAvg.differentiationScore,
      weight: 15
    },
    {
      key: "structuredDataScore",
      label: "结构化数据覆盖",
      score: Math.round(structuredDataScore),
      industryAvg: industryAvg.structuredDataScore,
      weight: 15
    }
  ];

  const overallScore = Math.round(
    dimensions.reduce((sum, dimension) => sum + dimension.score * (dimension.weight / 100), 0)
  );

  return {
    overallScore,
    grade: gradeFromScore(overallScore),
    dimensions
  };
}
