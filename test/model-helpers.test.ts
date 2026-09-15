import { getTimeoutMSByModel, showPlugins } from "../app/utils";
import { REQUEST_TIMEOUT_MS, ServiceProvider } from "../app/constant";

describe("getTimeoutMSByModel", () => {
  test("uses the unified timeout for every model", () => {
    const models = [
      "dall-e-3",
      "o1-preview",
      "deepseek-reasoner",
      "gpt-4",
      "claude-3-opus",
    ];
    for (const model of models) {
      expect(getTimeoutMSByModel(model)).toBe(REQUEST_TIMEOUT_MS);
    }
  });
});

describe("showPlugins", () => {
  test("is enabled for OpenAI, Azure, Moonshot and ChatGLM", () => {
    expect(showPlugins(ServiceProvider.OpenAI, "gpt-4")).toBe(true);
    expect(showPlugins(ServiceProvider.Azure, "gpt-4")).toBe(true);
    expect(showPlugins(ServiceProvider.Moonshot, "moonshot-v1-8k")).toBe(true);
    expect(showPlugins(ServiceProvider.ChatGLM, "glm-4")).toBe(true);
  });

  test("is enabled for Anthropic except claude-2 models", () => {
    expect(showPlugins(ServiceProvider.Anthropic, "claude-3-opus")).toBe(true);
    expect(showPlugins(ServiceProvider.Anthropic, "claude-2.1")).toBe(false);
  });

  test("is enabled for Google except vision models", () => {
    expect(showPlugins(ServiceProvider.Google, "gemini-pro")).toBe(true);
    expect(showPlugins(ServiceProvider.Google, "gemini-pro-vision")).toBe(
      false,
    );
  });

  test("is disabled for other providers", () => {
    expect(showPlugins(ServiceProvider.Baidu, "ernie-bot")).toBe(false);
    expect(showPlugins(ServiceProvider.Tencent, "hunyuan")).toBe(false);
  });
});
