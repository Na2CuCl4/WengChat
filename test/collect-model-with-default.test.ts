import {
  collectModelTableWithDefaultModel,
  collectModelsWithDefaultModel,
} from "../app/utils/model";
import { DEFAULT_MODELS } from "../app/constant";

describe("collectModelTableWithDefaultModel", () => {
  test("marks a fully-qualified default model (name@provider) as default", () => {
    const table = collectModelTableWithDefaultModel(
      DEFAULT_MODELS,
      "",
      "gpt-4@openai",
    );
    expect(table["gpt-4@openai"].isDefault).toBe(true);
  });

  test("marks the first available match when the default omits the provider", () => {
    const table = collectModelTableWithDefaultModel(
      DEFAULT_MODELS,
      "",
      "gpt-3.5-turbo",
    );
    expect(table["gpt-3.5-turbo@openai"].isDefault).toBe(true);
  });

  test("flags exactly one model as default", () => {
    const table = collectModelTableWithDefaultModel(
      DEFAULT_MODELS,
      "",
      "gpt-4@openai",
    );
    expect(Object.values(table).filter((m) => m.isDefault)).toHaveLength(1);
  });

  test("leaves every model un-flagged when defaultModel is empty", () => {
    const table = collectModelTableWithDefaultModel(DEFAULT_MODELS, "", "");
    expect(Object.values(table).some((m) => m.isDefault)).toBe(false);
  });

  test("matches a qualified default despite provider casing", () => {
    const table = collectModelTableWithDefaultModel(
      DEFAULT_MODELS,
      "",
      "gpt-4@OpenAI",
    );
    expect(table["gpt-4@openai"].isDefault).toBe(true);
    expect(Object.values(table).filter((m) => m.isDefault)).toHaveLength(1);
  });

  test("does not flag a disabled default model", () => {
    const table = collectModelTableWithDefaultModel(
      DEFAULT_MODELS,
      "-gpt-4@openai",
      "gpt-4@OpenAI",
    );
    expect(Object.values(table).some((m) => m.isDefault)).toBe(false);
  });

  test("matches ByteDance's logical name after an endpoint alias is set", () => {
    const table = collectModelTableWithDefaultModel(
      DEFAULT_MODELS,
      "+Doubao-lite-4k@bytedance=ep-xxx",
      "Doubao-lite-4k@bytedance",
    );
    expect(table["Doubao-lite-4k@bytedance"]).toMatchObject({
      name: "ep-xxx",
      displayName: "Doubao-lite-4k",
      isDefault: true,
    });
  });
});

describe("collectModelsWithDefaultModel", () => {
  test("returns the model list with exactly the chosen default flagged", () => {
    const models = collectModelsWithDefaultModel(
      DEFAULT_MODELS,
      "",
      "gpt-4@openai",
    );
    const defaults = models.filter((m) => m.isDefault);
    expect(defaults).toHaveLength(1);
    expect(defaults[0].name).toBe("gpt-4");
  });
});
