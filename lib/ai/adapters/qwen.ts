import { buildSearchPrompt, type ModelAdapter, type ModelRequest } from "@/lib/ai/adapters/base";
import { mockResponse } from "@/lib/ai/adapters/mock";

export class QwenAdapter implements ModelAdapter {
  modelName = "QWEN" as const;
  displayName = "通义千问";

  async query(request: ModelRequest) {
    const apiKey = process.env.QWEN_API_KEY;
    const apiUrl =
      process.env.QWEN_API_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

    if (!apiKey) {
      return {
        modelName: this.modelName,
        displayName: this.displayName,
        raw: mockResponse(this.modelName, this.displayName, request.brandName, request.question)
      };
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.QWEN_MODEL || "qwen-plus",
        messages: [{ role: "user", content: buildSearchPrompt(request) }],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`通义千问调用失败：${response.status}`);
    }

    return {
      modelName: this.modelName,
      displayName: this.displayName,
      raw: await response.json()
    };
  }
}
