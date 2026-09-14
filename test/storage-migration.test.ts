import { indexedDBStorage } from "@/app/utils/indexedDB-storage";

describe("WengChat storage migration", () => {
  test("keeps existing chat data when the store name changes", async () => {
    const state = JSON.stringify({ state: { messages: ["kept"] } });
    localStorage.setItem("chat-next-web-store", state);

    await expect(indexedDBStorage.getItem("wengchat-store")).resolves.toBe(
      state,
    );
    expect(localStorage.getItem("wengchat-store")).toBe(state);
    expect(localStorage.getItem("chat-next-web-store")).toBeNull();
  });
});
