import { buildSearchPrompt, type ModelAdapter, type ModelRequest } from "@/lib/ai/adapters/base";
import { mockResponse } from "@/lib/ai/adapters/mock";

export class DoubaoAdapter implements ModelAdapter {
  modelName = "DOUBAO" as const;
  displayName = "豆包";

  async query(request: ModelRequest) {
    const apiKey = process.env.DOUBAO_API_KEY;
    const apiUrl = process.env.DOUBAO_API_URL;

    if (!apiKey || !apiUrl) {
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
        model: process.env.DOUBAO_MODEL || "doubao-seed-1-6",
        messages: [{ role: "user", content: buildSearchPrompt(request) }],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`豆包调用失败：${response.status}`);
    }

    return {
      modelName: this.modelName,
      displayName: this.displayName,
      raw: await response.json()
    };
  }
}
