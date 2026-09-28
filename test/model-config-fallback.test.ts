import { DEFAULT_MODELS, ServiceProvider } from "../app/constant";
import type { ModelConfig } from "../app/store/config";
import {
  collectModelsWithDefaultModel,
  resolveModelConfig,
} from "../app/utils/model";

const config = (
  model: string,
  providerName: string,
  compressModel: string,
  compressProviderName: string,
) =>
  ({
    model,
    providerName,
    compressModel,
    compressProviderName,
    temperature: 0.37,
  }) as ModelConfig;

test.each([
  {
    name: "an invalid summary model falls back to the available default",
    custom: "-all,gpt-6-sol@openai,gpt-4@azure",
    defaultModel: "gpt-6-sol@OpenAI",
    current: config("gpt-4", "Azure", "gpt-5.4", "OpenAI"),
    expected: [
      "gpt-4",
      ServiceProvider.Azure,
      "gpt-6-sol",
      ServiceProvider.OpenAI,
    ],
  },
  {
    name: "valid current selections are retained",
    custom: "-all,gpt-6-sol@openai,gpt-4@azure",
    defaultModel: "gpt-6-sol@OpenAI",
    current: config("gpt-4", "Azure", "gpt-4", "Azure"),
    expected: ["gpt-4", ServiceProvider.Azure, "gpt-4", ServiceProvider.Azure],
  },
  {
    name: "a matching name under the wrong provider cannot keep the selection",
    custom: "-all,gpt-6-sol@openai,gpt-4@azure",
    defaultModel: "gpt-6-sol@OpenAI",
    current: config("gpt-4", "OpenAI", "gpt-4", "OpenAI"),
    expected: [
      "gpt-6-sol",
      ServiceProvider.OpenAI,
      "gpt-6-sol",
      ServiceProvider.OpenAI,
    ],
  },
  {
    name: "an empty default chooses the first available model",
    custom: "-all,gpt-4@openai,gpt-4@azure",
    defaultModel: "",
    current: config("gone", "OpenAI", "gone", "OpenAI"),
    expected: [
      "gpt-4",
      ServiceProvider.OpenAI,
      "gpt-4",
      ServiceProvider.OpenAI,
    ],
  },
  {
    name: "ByteDance's logical default resolves to its endpoint alias",
    custom: "-all,+Doubao-lite-4k@bytedance=ep-xxx",
    defaultModel: "Doubao-lite-4k@bytedance",
    current: config("gone", "ByteDance", "gone", "ByteDance"),
    expected: [
      "ep-xxx",
      ServiceProvider.ByteDance,
      "ep-xxx",
      ServiceProvider.ByteDance,
    ],
  },
])(
  "resolveModelConfig: $name",
  ({ custom, defaultModel, current, expected }) => {
    const models = collectModelsWithDefaultModel(
      DEFAULT_MODELS,
      custom,
      defaultModel,
    );
    const resolved = resolveModelConfig(current, models);
    expect(
      resolved && [
        resolved.model,
        resolved.providerName,
        resolved.compressModel,
        resolved.compressProviderName,
      ],
    ).toEqual(expected);
    expect(resolved?.temperature).toBe(current.temperature);
  },
);

test("resolveModelConfig returns undefined when no model is available", () => {
  const models = collectModelsWithDefaultModel(
    DEFAULT_MODELS,
    "-all",
    "gpt-4@OpenAI",
  );
  expect(
    resolveModelConfig(config("gpt-4", "OpenAI", "gpt-4", "OpenAI"), models),
  ).toBeUndefined();
});
