import { LLMModel } from "../client/api";
import {
  DalleQuality,
  DalleStyle,
  ModelSize,
  ReasoningEffort,
  ResponseFormatType,
  Verbosity,
} from "../typing";
import { getClientConfig } from "../config/client";
import {
  DEFAULT_INPUT_TEMPLATE,
  DEFAULT_MODELS,
  DEFAULT_SIDEBAR_WIDTH,
  DEFAULT_TTS_ENGINE,
  DEFAULT_TTS_ENGINES,
  DEFAULT_TTS_MODEL,
  DEFAULT_TTS_MODELS,
  DEFAULT_TTS_VOICE,
  DEFAULT_TTS_VOICES,
  StoreKey,
  ServiceProvider,
} from "../constant";
import { createPersistStore } from "../utils/store";
import type { Voice } from "rt-client";

export type ModelType = (typeof DEFAULT_MODELS)[number]["name"];
export type TTSModelType = (typeof DEFAULT_TTS_MODELS)[number];
export type TTSVoiceType = (typeof DEFAULT_TTS_VOICES)[number];
export type TTSEngineType = (typeof DEFAULT_TTS_ENGINES)[number];

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

const config = getClientConfig();

export const DEFAULT_CONFIG = {
  lastUpdate: Date.now(), // timestamp, to merge state

  submitKey: SubmitKey.Enter,
  avatar: "1f603",
  fontSize: 14,
  fontFamily: "",
  theme: Theme.Auto as Theme,
  tightBorder: !!config?.isApp,
  sendPreviewBubble: true,
  enableAutoGenerateTitle: true,
  sidebarWidth: DEFAULT_SIDEBAR_WIDTH,

  enableArtifacts: true, // show artifacts config

  enableCodeFold: true, // code fold config

  disablePromptHint: false,

  dontShowMaskSplashScreen: false, // dont show splash screen when create chat
  hideBuiltinMasks: false, // dont add builtin masks

  customModels: "",
  models: DEFAULT_MODELS as any as LLMModel[],

  modelConfig: {
    model: "" as ModelType,
    providerName: "" as ServiceProvider,
    temperature: 1,
    top_p: 1,
    max_tokens: 128000,
    presence_penalty: 0,
    frequency_penalty: 0,
    sendMemory: true,
    historyMessageCount: 16,
    compressMessageLengthThreshold: 64000,
    compressModel: "" as ModelType,
    compressProviderName: "" as ServiceProvider,
    enableInjectSystemPrompts: false,
    template: config?.template ?? DEFAULT_INPUT_TEMPLATE,
    size: "1024x1024" as ModelSize,
    quality: "standard" as DalleQuality,
    style: "vivid" as DalleStyle,
    reasoning_effort: "medium" as ReasoningEffort,
    verbosity: "medium" as Verbosity,
    response_format: "text" as ResponseFormatType,
    json_schema: "",
  },

  ttsConfig: {
    enable: false,
    autoplay: false,
    engine: DEFAULT_TTS_ENGINE,
    model: DEFAULT_TTS_MODEL,
    voice: DEFAULT_TTS_VOICE,
    speed: 1.0,
  },

  realtimeConfig: {
    enable: false,
    provider: "OpenAI" as ServiceProvider,
    model: "gpt-4o-realtime-preview-2024-10-01",
    apiKey: "",
    azure: {
      endpoint: "",
      deployment: "",
    },
    temperature: 0.9,
    voice: "alloy" as Voice,
  },

  fileConversionConfig: {
    engine: "markitdown" as "markitdown" | "mineru",
    enableDocIntelligence: false,
    minerUBackend: "hybrid-engine" as
      | "pipeline"
      | "vlm-engine"
      | "hybrid-engine",
    minerUTier: "standard" as "flash" | "basic" | "standard" | "advanced",
    maxPages: 1000,
    enableTableRecognition: true,
    enableInlineFormulaRecognition: true,
    enableImageAnalysis: true,
    parseMethod: "auto" as "auto" | "txt" | "ocr",
    ocrLanguage: "ch" as
      | "ch"
      | "ch_server"
      | "korean"
      | "ta"
      | "te"
      | "ka"
      | "th"
      | "el"
      | "arabic"
      | "east_slavic"
      | "cyrillic"
      | "devanagari",
    effort: "medium" as "medium" | "high",
  },
};

export type ChatConfig = typeof DEFAULT_CONFIG;

export type ModelConfig = ChatConfig["modelConfig"];
export type TTSConfig = ChatConfig["ttsConfig"];
export type RealtimeConfig = ChatConfig["realtimeConfig"];
export type FileConversionConfig = ChatConfig["fileConversionConfig"];

export function limitNumber(
  x: number,
  min: number,
  max: number,
  defaultValue: number,
) {
  if (isNaN(x)) {
    return defaultValue;
  }

  return Math.min(max, Math.max(min, x));
}

export const TTSConfigValidator = {
  engine(x: string) {
    return x as TTSEngineType;
  },
  model(x: string) {
    return x as TTSModelType;
  },
  voice(x: string) {
    return x as TTSVoiceType;
  },
  speed(x: number) {
    return limitNumber(x, 0.25, 4.0, 1.0);
  },
};

export const ModalConfigValidator = {
  model(x: string) {
    return x as ModelType;
  },
  max_tokens(x: number) {
    return limitNumber(x, 0, 512000, 1024);
  },
  presence_penalty(x: number) {
    return limitNumber(x, -2, 2, 0);
  },
  frequency_penalty(x: number) {
    return limitNumber(x, -2, 2, 0);
  },
  temperature(x: number) {
    return limitNumber(x, 0, 2, 1);
  },
  top_p(x: number) {
    return limitNumber(x, 0, 1, 1);
  },
};

export const useAppConfig = createPersistStore(
  { ...DEFAULT_CONFIG },
  (set, get) => ({
    reset() {
      set(() => ({ ...DEFAULT_CONFIG }));
    },

    mergeModels(newModels: LLMModel[]) {
      if (!newModels || newModels.length === 0) {
        return;
      }

      const oldModels = get().models;
      const modelMap: Record<string, LLMModel> = {};

      for (const model of oldModels) {
        modelMap[`${model.name}@${model?.provider?.id}`] = {
          ...model,
          available: false,
        };
      }

      for (const model of newModels) {
        modelMap[`${model.name}@${model?.provider?.id}`] = {
          ...model,
          available: true,
        };
      }

      set(() => ({
        models: Object.values(modelMap),
      }));
    },

    allModels() {},
  }),
  {
    name: StoreKey.Config,
    version: 4.1,

    merge(persistedState, currentState) {
      const state = persistedState as ChatConfig | undefined;
      if (!state) return { ...currentState };
      const models = currentState.models.slice();
      state.models.forEach((pModel) => {
        const idx = models.findIndex(
          (v) =>
            v.name === pModel.name &&
            v.provider?.id.toLowerCase() === pModel.provider?.id.toLowerCase(),
        );
        if (idx !== -1) models[idx] = pModel;
        else models.push(pModel);
      });
      return { ...currentState, ...state, models: models };
    },

    migrate(persistedState, version) {
      const state = persistedState as ChatConfig;

      if (version < 3.4) {
        state.modelConfig.sendMemory = true;
        state.modelConfig.historyMessageCount = 4;
        state.modelConfig.compressMessageLengthThreshold = 1000;
        state.modelConfig.presence_penalty = 0;
        state.modelConfig.frequency_penalty = 0;
        state.modelConfig.top_p = 1;
        state.modelConfig.template = DEFAULT_INPUT_TEMPLATE;
        state.dontShowMaskSplashScreen = false;
        state.hideBuiltinMasks = false;
      }

      if (version < 3.5) {
        state.customModels = "claude,claude-100k";
      }

      if (version < 3.6) {
        state.modelConfig.enableInjectSystemPrompts = false;
      }

      if (version < 3.7) {
        state.enableAutoGenerateTitle = true;
      }

      if (version < 3.8) {
        state.lastUpdate = Date.now();
      }

      if (version < 3.9) {
        state.modelConfig.template =
          state.modelConfig.template !== DEFAULT_INPUT_TEMPLATE
            ? state.modelConfig.template
            : config?.template ?? DEFAULT_INPUT_TEMPLATE;
      }

      if (version < 4.1) {
        state.modelConfig.compressModel =
          DEFAULT_CONFIG.modelConfig.compressModel;
        state.modelConfig.compressProviderName =
          DEFAULT_CONFIG.modelConfig.compressProviderName;
      }

      return state as any;
    },
  },
);
