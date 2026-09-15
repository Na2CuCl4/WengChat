import { getClientConfig } from "../config/client";
import { ApiPath, STORAGE_KEY, StoreKey } from "../constant";
import { createPersistStore } from "../utils/store";
import {
  AppState,
  getLocalAppState,
  GetStoreState,
  mergeAppState,
  setLocalAppState,
} from "../utils/sync";
import { downloadAs, readFromFile } from "../utils";
import { showToast } from "../components/ui-lib";
import Locale from "../locales";
import { createSyncClient, ProviderType } from "../utils/cloud";

const SYNC_LOCK_NAME = "nextchat-sync-lock";
const SYNC_LOCK_KEY = "nextchat-sync-lock-owner";
const SYNC_LOCK_TTL = 5 * 60 * 1000;
const SYNC_LOCK_OWNER = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

let inFlightSyncPromise: Promise<boolean> | null = null;

function getNow() {
  return Date.now();
}

function tryAcquireStorageLock() {
  if (typeof window === "undefined") return false;

  try {
    const now = getNow();
    const raw = window.localStorage.getItem(SYNC_LOCK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { owner: string; expireAt: number };
      if (parsed.expireAt > now && parsed.owner !== SYNC_LOCK_OWNER) {
        return false;
      }
    }

    const lockValue = JSON.stringify({
      owner: SYNC_LOCK_OWNER,
      expireAt: now + SYNC_LOCK_TTL,
    });
    window.localStorage.setItem(SYNC_LOCK_KEY, lockValue);

    const confirmed = window.localStorage.getItem(SYNC_LOCK_KEY);
    if (!confirmed) return false;
    const confirmedParsed = JSON.parse(confirmed) as {
      owner: string;
      expireAt: number;
    };
    return confirmedParsed.owner === SYNC_LOCK_OWNER;
  } catch {
    return false;
  }
}

function releaseStorageLock() {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(SYNC_LOCK_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { owner: string; expireAt: number };
    if (parsed.owner === SYNC_LOCK_OWNER) {
      window.localStorage.removeItem(SYNC_LOCK_KEY);
    }
  } catch {
    // ignore lock release errors
  }
}

async function runSyncWithGlobalLock(task: () => Promise<void>) {
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    let executed = false;
    await navigator.locks.request(
      SYNC_LOCK_NAME,
      { mode: "exclusive", ifAvailable: true },
      async (lock) => {
        if (!lock) return;
        executed = true;
        await task();
      },
    );
    return executed;
  }

  if (!tryAcquireStorageLock()) {
    return false;
  }

  try {
    await task();
    return true;
  } finally {
    releaseStorageLock();
  }
}

export interface WebDavConfig {
  server: string;
  username: string;
  password: string;
}

const isApp = !!getClientConfig()?.isApp;
export type SyncStore = GetStoreState<typeof useSyncStore>;

const DEFAULT_SYNC_STATE = {
  provider: ProviderType.WebDAV,
  useProxy: true,
  proxyUrl: ApiPath.Cors as string,

  webdav: {
    endpoint: "",
    username: "",
    password: "",
  },

  upstash: {
    endpoint: "",
    username: STORAGE_KEY,
    apiKey: "",
  },

  lastSyncTime: 0,
  lastProvider: "",

  autoSyncInterval: 0, // in ms, 0 means never

  isSyncing: false,
};

export const useSyncStore = createPersistStore(
  DEFAULT_SYNC_STATE,
  (set, get) => ({
    cloudSync() {
      const config = get()[get().provider];
      return Object.values(config).every((c) => c.toString().length > 0);
    },

    markSyncTime() {
      set({ lastSyncTime: Date.now(), lastProvider: get().provider });
    },

    export() {
      const state = getLocalAppState();
      const datePart = isApp
        ? `${new Date().toLocaleDateString().replace(/\//g, "_")} ${new Date()
            .toLocaleTimeString()
            .replace(/:/g, "_")}`
        : new Date().toLocaleString();

      const fileName = `Backup-${datePart}.json`;
      downloadAs(JSON.stringify(state), fileName);
    },

    async import() {
      const rawContent = await readFromFile();

      try {
        const remoteState = JSON.parse(rawContent) as AppState;
        const localState = getLocalAppState();
        mergeAppState(localState, remoteState);
        setLocalAppState(localState);
        location.reload();
      } catch (e) {
        console.error("[Import]", e);
        showToast(Locale.Settings.Sync.ImportFailed);
      }
    },

    getClient() {
      const provider = get().provider;
      const client = createSyncClient(provider, get());
      return client;
    },

    async sync() {
      if (inFlightSyncPromise) {
        return false;
      }

      inFlightSyncPromise = (async () => {
        set({ isSyncing: true } as any);
        return await runSyncWithGlobalLock(async () => {
          const localState = getLocalAppState();
          const provider = get().provider;
          const config = get()[provider];
          const client = this.getClient();

          try {
            const remoteState = await client.get(config.username);
            if (!remoteState || remoteState === "") {
              await client.set(config.username, JSON.stringify(localState));
              console.log(
                "[Sync] Remote state is empty, using local state instead.",
              );
              return;
            } else {
              const parsedRemoteState = JSON.parse(
                await client.get(config.username),
              ) as AppState;
              mergeAppState(localState, parsedRemoteState);
              setLocalAppState(localState);
            }
          } catch (e) {
            console.log("[Sync] failed to get remote state", e);
            throw e;
          }

          await client.set(config.username, JSON.stringify(localState));

          this.markSyncTime();
        });
      })();

      try {
        return await inFlightSyncPromise;
      } finally {
        inFlightSyncPromise = null;
        set({ isSyncing: false } as any);
      }
    },

    async check() {
      const client = this.getClient();
      return await client.check();
    },

    getSyncInterval() {
      switch (get().autoSyncInterval) {
        case 60 * 60 * 1000:
          return Locale.Settings.Sync.Interval.Selection.Hourly;
        case 24 * 60 * 60 * 1000:
          return Locale.Settings.Sync.Interval.Selection.Daily;
        case 7 * 24 * 60 * 60 * 1000:
          return Locale.Settings.Sync.Interval.Selection.Weekly;
        case 30 * 24 * 60 * 60 * 1000:
          return Locale.Settings.Sync.Interval.Selection.Monthly;
        default:
          return Locale.Settings.Sync.Interval.Selection.Never;
      }
    },

    setSyncInterval(v: string) {
      switch (v) {
        case Locale.Settings.Sync.Interval.Selection.Hourly:
          set({ autoSyncInterval: 60 * 60 * 1000 });
          break;
        case Locale.Settings.Sync.Interval.Selection.Daily:
          set({ autoSyncInterval: 24 * 60 * 60 * 1000 });
          break;
        case Locale.Settings.Sync.Interval.Selection.Weekly:
          set({ autoSyncInterval: 7 * 24 * 60 * 60 * 1000 });
          break;
        case Locale.Settings.Sync.Interval.Selection.Monthly:
          set({ autoSyncInterval: 30 * 24 * 60 * 60 * 1000 });
          break;
        default:
          set({ autoSyncInterval: 0 });
          break;
      }
    },
  }),
  {
    name: StoreKey.Sync,
    version: 1.2,

    migrate(persistedState, version) {
      const newState = persistedState as typeof DEFAULT_SYNC_STATE;

      if (version < 1.1) {
        newState.upstash.username = STORAGE_KEY;
      }

      if (version < 1.2) {
        if (
          (persistedState as typeof DEFAULT_SYNC_STATE).proxyUrl ===
          "/api/cors/"
        ) {
          newState.proxyUrl = "";
        }
      }

      return newState as any;
    },
  },
);
