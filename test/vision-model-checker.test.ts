import { jest } from "@jest/globals";
import { isGpt5Or6Model, isVisionModel } from "../app/utils";

describe("isVisionModel", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should identify vision models using regex patterns", () => {
    const visionModels = [
      "gpt-4-vision",
      "claude-3-opus",
      "gemini-1.5-pro",
      "gemini-2.0",
      "gemini-exp-vision",
      "learnlm-vision",
      "qwen-vl-max",
      "qwen2-vl-max",
      "gpt-4-turbo",
      "dall-e-3",
      "gpt-5.4",
      "gpt-6",
      "gpt-6-sol",
    ];

    visionModels.forEach((model) => {
      expect(isVisionModel(model)).toBe(true);
    });
  });

  test("should exclude specific models", () => {
    expect(isVisionModel("claude-3-5-haiku-20241022")).toBe(false);
  });

  test("should not identify non-vision models", () => {
    const nonVisionModels = [
      "gpt-3.5-turbo",
      "gpt-4-turbo-preview",
      "claude-2",
      "regular-model",
      "gpt-60",
    ];

    nonVisionModels.forEach((model) => {
      expect(isVisionModel(model)).toBe(false);
    });
  });

  test("uses GPT-5 and GPT-6 request settings only for those families", () => {
    expect(isGpt5Or6Model("gpt-5.4-pro")).toBe(true);
    expect(isGpt5Or6Model("gpt-6-sol")).toBe(true);
    expect(isGpt5Or6Model("gpt-60")).toBe(false);
  });

  test("should identify models from VISION_MODELS env var", () => {
    process.env.VISION_MODELS = "custom-vision-model,another-vision-model";

    expect(isVisionModel("custom-vision-model")).toBe(true);
    expect(isVisionModel("another-vision-model")).toBe(true);
    expect(isVisionModel("unrelated-model")).toBe(false);
  });

  test("should handle empty or missing VISION_MODELS", () => {
    process.env.VISION_MODELS = "";
    expect(isVisionModel("unrelated-model")).toBe(false);

    delete process.env.VISION_MODELS;
    expect(isVisionModel("unrelated-model")).toBe(false);
    expect(isVisionModel("gpt-4-vision")).toBe(true);
  });
});
