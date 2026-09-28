import { jest } from "@jest/globals";
import { DEFAULT_MODELS, ServiceProvider } from "../app/constant";

jest.unstable_mockModule("@/app/client/api", () => ({
  getHeaders: () => ({}),
  getClientApi: () => ({ llm: { models: async () => [] } }),
  ClientApi: class {},
  LLMApi: class {},
}));
jest.unstable_mockModule("@/app/components/ui-lib", () => ({
  showToast: jest.fn(),
}));
jest.unstable_mockModule("@/app/locales", () => ({
  __esModule: true,
  default: { Store: { DefaultTopic: "New Chat", BotHello: "Hello" } },
  getLang: () => "en",
}));
jest.unstable_mockModule("@/app/utils/indexedDB-storage", () => ({
  indexedDBStorage: {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
    clear: async () => {},
  },
}));

test("startup repairs stale main and summary models after fresh server config", async () => {
  const { showToast } = await import("../app/components/ui-lib");
  const { useAccessStore } = await import("../app/store/access");
  const { useAppConfig } = await import("../app/store/config");
  const { ensureModelConfigsReady, resolveSessionModelConfig, useChatStore } =
    await import("../app/store/chat");
  await Promise.all([
    useAccessStore.persist.rehydrate(),
    useAppConfig.persist.rehydrate(),
    useChatStore.persist.rehydrate(),
  ]);

  const oldConfig = {
    ...useAppConfig.getState().modelConfig,
    model: "gpt-5.4" as (typeof DEFAULT_MODELS)[number]["name"],
    providerName: ServiceProvider.OpenAI,
    compressModel: "gpt-5.4" as (typeof DEFAULT_MODELS)[number]["name"],
    compressProviderName: ServiceProvider.OpenAI,
  };
  useAppConfig.setState({ modelConfig: oldConfig });
  useAccessStore.setState({
    customModels: "-all,gpt-5.4@openai",
    defaultModel: "gpt-5.4@openai",
  });
  const session = useChatStore.getState().sessions[0];
  session.mask.modelConfig = { ...oldConfig };
  session.mask.syncGlobalConfig = true;
  useChatStore.setState({ sessions: [session], currentSessionIndex: 0 });

  const serverConfig = {
    customModels: "-all,gpt-6-sol@openai",
    defaultModel: "gpt-6-sol@OpenAI",
  };
  let failFirstRequest = true;
  (global.fetch as jest.Mock).mockImplementation(async (url: string) => {
    if (url === "/api/config") {
      if (failFirstRequest) {
        failFirstRequest = false;
        throw new Error("config unavailable");
      }
      return { ok: true, status: 200, json: async () => serverConfig };
    }
    return { ok: true, status: 200, json: async () => [] };
  });

  const logError = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(await ensureModelConfigsReady()).toBe(false);
  expect(useAppConfig.getState().modelConfig.model).toBe("gpt-5.4");
  expect(
    useChatStore.getState().currentSession().mask.modelConfig.compressModel,
  ).toBe("gpt-5.4");
  expect(() => resolveSessionModelConfig(session)).toThrow(
    "Failed to load server model configuration",
  );
  expect(showToast).not.toHaveBeenCalled();
  logError.mockRestore();

  expect(await ensureModelConfigsReady()).toBe(true);
  const globalConfig = useAppConfig.getState().modelConfig;
  const current = useChatStore.getState().currentSession().mask.modelConfig;
  expect([globalConfig.model, globalConfig.compressModel]).toEqual([
    "gpt-6-sol",
    "gpt-6-sol",
  ]);
  expect([current.model, current.compressModel]).toEqual([
    "gpt-6-sol",
    "gpt-6-sol",
  ]);
  expect(showToast).toHaveBeenCalledWith("gpt-6-sol (OpenAI)");
  expect(
    (globalThis.fetch as jest.Mock).mock.calls.filter(
      ([url]) => url === "/api/config",
    ),
  ).toHaveLength(2);
});
