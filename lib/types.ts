export type AiModelName = "DOUBAO" | "DEEPSEEK" | "QWEN";
export type TaskStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
export type MentionStatus = "主动推荐" | "提及推荐" | "对比提及" | "未提及";
export type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type QuestionSource = "AI_GENERATED" | "USER_MANUAL";

export type MonitoringQuestion = {
  id: string;
  text: string;
  source: QuestionSource;
  enabled: boolean;
};

export type Citation = {
  title?: string;
  url?: string;
  source?: string;
};

export type ParsedModelResult = {
  modelName: AiModelName;
  displayName: string;
  answerText: string;
  citations: Citation[];
  mentionStatus: MentionStatus;
  mentionStrength: number;
  sentiment: Sentiment;
  snippets: string[];
  rawResponse: unknown;
};

export type DimensionScore = {
  key:
    | "searchRecommendScore"
    | "infoCompletenessScore"
    | "authorityScore"
    | "differentiationScore"
    | "structuredDataScore";
  label: string;
  score: number;
  industryAvg: number;
  weight: number;
};

export type DiagnosisReport = {
  taskId: string;
  brandName: string;
  industry?: string;
  status: TaskStatus;
  progress: number;
  overallScore: number;
  grade: string;
  dimensions: DimensionScore[];
  questions: MonitoringQuestion[];
  modelResults: ParsedModelResult[];
  shareUrl: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
};

export type ScanTaskRecord = {
  taskId: string;
  brandName: string;
  industry?: string;
  status: TaskStatus;
  progress: number;
  questions: MonitoringQuestion[];
  modelResults: ParsedModelResult[];
  report?: DiagnosisReport;
  shareSlug: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
};

export type RegisterUserInput = {
  email: string;
  password: string;
};
