import { jest } from "@jest/globals";
import { ChatGPTApi } from "../app/client/platforms/openai";
import { ServiceProvider } from "../app/constant";

test("GPT-6 sends image content with max_completion_tokens", async () => {
  const originalFetch = window.fetch;
  const request = jest.fn(async () => ({
    json: async () => ({ choices: [{ message: { content: "ok" } }] }),
  }));
  window.fetch = request as any;
  const onFinish = jest.fn();
  const onError = jest.fn();

  try {
    await new ChatGPTApi().chat({
      config: {
        model: "gpt-6-sol",
        providerName: ServiceProvider.OpenAI,
        stream: false,
      },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is this?" },
            {
              type: "image_url",
              image_url: { url: "data:image/png;base64,dGVzdA==" },
            },
          ],
        },
      ],
      onFinish,
      onError,
    } as any);

    expect(onError).not.toHaveBeenCalled();
    expect(onFinish).toHaveBeenCalledWith("ok", expect.anything());
    const payload = JSON.parse((request.mock.calls[0] as any)[1].body);
    expect(payload.messages[0].content[1].image_url.url).toBe(
      "data:image/png;base64,dGVzdA==",
    );
    expect(payload.max_completion_tokens).toEqual(expect.any(Number));
    expect(payload).not.toHaveProperty("max_tokens");
  } finally {
    window.fetch = originalFetch;
  }
});
