import { StateStorage } from "zustand/middleware";
import { get, set, del, clear } from "idb-keyval";
import { safeLocalStorage } from "@/app/utils";

const localStorage = safeLocalStorage();
// ponytail: one-release bridge; remove after v2.19.x clients have migrated.
const LEGACY_KEYS: Record<string, string> = {
  "wengchat-store": "chat-next-web-store",
  "wengchat-plugin": "chat-next-web-plugin",
};

class IndexedDBStorage implements StateStorage {
  public async getItem(name: string): Promise<string | null> {
    const legacyName = LEGACY_KEYS[name];
    try {
      let value = (await get(name)) || localStorage.getItem(name);
      if (!value && legacyName) {
        value = (await get(legacyName)) || localStorage.getItem(legacyName);
        if (value) {
          await set(name, value);
          await del(legacyName);
          localStorage.removeItem(legacyName);
        }
      }
      return value;
    } catch (error) {
      const value =
        localStorage.getItem(name) ||
        (legacyName ? localStorage.getItem(legacyName) : null);
      if (value && legacyName) {
        localStorage.setItem(name, value);
        localStorage.removeItem(legacyName);
      }
      return value;
    }
  }

  public async setItem(name: string, value: string): Promise<void> {
    try {
      const _value = JSON.parse(value);
      if (!_value?.state?._hasHydrated) {
        console.warn("skip setItem", name);
        return;
      }
      await set(name, value);
    } catch (error) {
      localStorage.setItem(name, value);
    }
  }

  public async removeItem(name: string): Promise<void> {
    try {
      await del(name);
    } catch (error) {
      localStorage.removeItem(name);
    }
  }

  public async clear(): Promise<void> {
    try {
      await clear();
    } catch (error) {
      localStorage.clear();
    }
  }
}

export const indexedDBStorage = new IndexedDBStorage();
