# 三三狐 GEO MVP

三三狐（SanSanFox）GEO 优化平台 Phase 1 MVP。输入品牌词即可生成开放诊断报告，覆盖豆包、DeepSeek、通义千问 3 个模型的查询适配与结果解析。

## 功能范围

- 首页免注册品牌诊断入口
- 混合监控词条：AI 自动生成 + 用户手动添加
- 异步扫描任务，前端轮询进度
- 五维度 GEO 评分与行业均值对比
- AI 原文高亮、提及状态、推荐强度、情感标签
- 报告分享链接
- 邮箱注册登录、免费版套餐
- 三栏定价页与 MVP 模拟支付

## 技术栈

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui 风格组件
- Prisma + PostgreSQL
- BullMQ + Redis
- NextAuth.js
- Recharts

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run dev
```

访问 `http://localhost:3000`。

未配置大模型 API Key 时，系统会使用 mock 响应跑通完整诊断流程。

## 生产配置

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
REDIS_URL=
DOUBAO_API_KEY=
DOUBAO_API_URL=
DEEPSEEK_API_KEY=
QWEN_API_KEY=
```

配置 `REDIS_URL` 后，可单独启动扫描 Worker：

```bash
npm run worker
```
