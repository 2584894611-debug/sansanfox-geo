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
  const avgStrength =
    results.reduce((sum, result) => sum + result.mentionStrength, 0) / Math.max(results.length, 1);
  const positiveCount = results.filter((result) => result.sentiment === "POSITIVE").length;
  const citationCount = results.reduce((sum, result) => sum + result.citations.length, 0);
  const textRichness = results.reduce((sum, result) => sum + Math.min(result.answerText.length / 9, 100), 0) / Math.max(results.length, 1);

  const searchRecommendScore = clamp((mentioned.length / Math.max(results.length, 1)) * 62 + avgStrength * 38);
  const infoCompletenessScore = clamp(textRichness * 0.48 + mentioned.length * 10 + positiveCount * 4);
  const authorityScore = clamp(citationCount * 12 + avgStrength * 42 + positiveCount * 6);
  const differentiationScore = clamp(
    results.filter((result) => /差异|优势|特色|适合|推荐|定位/.test(result.answerText)).length * 24 +
      avgStrength * 30
  );
  const structuredDataScore = clamp(citationCount * 9 + mentioned.length * 12 + 28);

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
