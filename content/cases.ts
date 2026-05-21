export interface CaseStudy {
  id: string;
  brand: string;
  industry: string;
  location: string;
  geoScore: number;
  grade: string; // A/B/C/D
  aiSearchRate: number;
  brandCompleteness: number;
  contentAuthority: number;
  differentiation: number;
  topIssue: string;
  strengths: string[];
  weaknesses: string[];
  thumbnail?: string;
  reportUrl?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "wuhan-ivu",
    brand: "武汉荟聚",
    industry: "商业地产",
    location: "武汉硚口",
    geoScore: 57,
    grade: "C+",
    aiSearchRate: 65,
    brandCompleteness: 52,
    contentAuthority: 48,
    differentiation: 62,
    topIssue: "宜家品牌背书强但独立品牌认知不足",
    strengths: ["亲子标签鲜明", "北欧风格独特", "宜家IP赋能"],
    weaknesses: ["高端搜索被压制", "百科信息陈旧", "独立搜索指数低"],
    thumbnail: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
  },
  {
    id: "wuhan-csprings",
    brand: "武汉大悦城",
    industry: "商业地产",
    location: "武汉光谷",
    geoScore: 60,
    grade: "C+",
    aiSearchRate: 72,
    brandCompleteness: 55,
    contentAuthority: 52,
    differentiation: 58,
    topIssue: "TOD交通优势突出但品牌定位表述不统一",
    strengths: ["双地铁直达", "IP首展吸引", "年轻化定位"],
    weaknesses: ["定位表述3个版本", "经营数据未同步AI", "官方内容分散"],
    thumbnail: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&h=300&fit=crop",
  },
  {
    id: "wuhan-tianchi",
    brand: "武汉天地",
    industry: "商业地产",
    location: "武汉汉口",
    geoScore: 68,
    grade: "B-",
    aiSearchRate: 78,
    brandCompleteness: 65,
    contentAuthority: 70,
    differentiation: 58,
    topIssue: "石库门建筑+江滩景观，信息积累深厚但新更名认知断层",
    strengths: ["高端餐饮标签", "城市更新标杆", "历史建筑特色"],
    weaknesses: ["更名认知断层", "百科信息陈旧", "差异化定位模糊"],
    thumbnail: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop",
  },
  {
    id: "wuhan-tianjie",
    brand: "武汉江宸天街",
    industry: "商业地产",
    location: "武汉范湖",
    geoScore: 52,
    grade: "C",
    aiSearchRate: 58,
    brandCompleteness: 48,
    contentAuthority: 42,
    differentiation: 55,
    topIssue: "龙湖品牌背书但内容权威性全面偏低",
    strengths: ["TOD枢纽优势", "潮尚社交定位", "龙湖品牌支撑"],
    weaknesses: ["官网缺Schema", "E-E-A-T全面偏低", "专业内容稀缺"],
    thumbnail: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&h=300&fit=crop",
  },
  {
    id: "wuhan-k11",
    brand: "武汉K11 Select",
    industry: "商业地产",
    location: "武汉光谷",
    geoScore: 70,
    grade: "B-",
    aiSearchRate: 80,
    brandCompleteness: 68,
    contentAuthority: 72,
    differentiation: 65,
    topIssue: "艺术商业标签独特但体量小限制品牌密度",
    strengths: ["艺术潮趣定位", "K11品牌背书", "独特定位鲜明"],
    weaknesses: ["体量限制品牌密度", "覆盖范围有限", "搜索量基数小"],
    thumbnail: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&h=300&fit=crop",
  },
  {
    id: "wuhan-mixc",
    brand: "武汉万象城",
    industry: "商业地产",
    location: "武汉汉口",
    geoScore: 75,
    grade: "B",
    aiSearchRate: 82,
    brandCompleteness: 75,
    contentAuthority: 78,
    differentiation: 68,
    topIssue: "华润品牌背书强但交通标签AI识别率低",
    strengths: ["高端品质定位", "品牌首店多", "华润品牌背书"],
    weaknesses: ["交通标签识别率低", "周边配套信息少", "差异化表述弱"],
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
  },
  {
    id: "wuhan-mall",
    brand: "武商MALL",
    industry: "商业地产",
    location: "武汉汉口",
    geoScore: 68,
    grade: "B-",
    aiSearchRate: 75,
    brandCompleteness: 72,
    contentAuthority: 68,
    differentiation: 58,
    topIssue: "老牌高端商场体量最大但数字化内容薄弱",
    strengths: ["体量规模最大", "高端奢品标签", "历史积淀深厚"],
    weaknesses: ["数字化内容薄弱", "新媒体运营弱", "年轻化转型慢"],
    thumbnail: "https://images.unsplash.com/photo-1555529669-2269763671c0?w=400&h=300&fit=crop",
  },

];

export function getScoreColor(score: number): string {
  if (score < 50) return "text-red-500";
  if (score < 70) return "text-amber-500";
  return "text-green-500";
}

export function getScoreBgColor(score: number): string {
  if (score < 50) return "bg-red-50 border-red-200";
  if (score < 70) return "bg-amber-50 border-amber-200";
  return "bg-green-50 border-green-200";
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case "A":
    case "A+":
    case "A-":
      return "bg-green-100 text-green-700";
    case "B":
    case "B+":
    case "B-":
      return "bg-blue-100 text-blue-700";
    case "C":
    case "C+":
    case "C-":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export const industries = ["全部", "商业地产", "营销传媒"];
export const grades = ["全部", "A", "B", "C", "D"];
