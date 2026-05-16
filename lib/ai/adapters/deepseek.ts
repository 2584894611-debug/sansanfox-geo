import { buildSearchPrompt, type ModelAdapter, type ModelRequest } from "@/lib/ai/adapters/base";
import { mockResponse } from "@/lib/ai/adapters/mock";

export class DeepSeekAdapter implements ModelAdapter {
  modelName = "DEEPSEEK" as const;
  displayName = "DeepSeek";

  async query(request: ModelRequest) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions";

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
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [{ role: "user", content: buildSearchPrompt(request) }],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek调用失败：${response.status}`);
    }

    return {
      modelName: this.modelName,
      displayName: this.displayName,
      raw: await response.json()
    };
  }
}
