import {
  getMinerUApiVersion,
  getMinerUHealth,
  getMinerUV1Tier,
} from "../app/api/mineru";

describe("MinerU API compatibility", () => {
  test("maps only supported MinerU release lines", () => {
    expect(getMinerUApiVersion("3.4.9")).toBe("v0");
    expect(getMinerUApiVersion("4.0.0a6")).toBe("v1");
    expect(() => getMinerUApiVersion("3.3.2")).toThrow(
      "Unsupported MinerU version: 3.3.2",
    );
    expect(() => getMinerUApiVersion("4.1.0")).toThrow(
      "Unsupported MinerU version: 4.1.0",
    );
  });

  test("keeps the official v0 setting to v1 tier fallback", () => {
    expect(getMinerUV1Tier(undefined, "pipeline", "high")).toBe("basic");
    expect(getMinerUV1Tier(undefined, "vlm-engine", "medium")).toBe("advanced");
    expect(getMinerUV1Tier(undefined, "hybrid-engine", "medium")).toBe("basic");
    expect(getMinerUV1Tier(undefined, "hybrid-engine", "high")).toBe(
      "standard",
    );
    expect(getMinerUV1Tier("flash")).toBe("flash");
  });

  test("reports a reachable but unsupported MinerU version", async () => {
    const originalFetch = global.fetch;
    global.fetch = (async () =>
      ({
        ok: true,
        json: async () => ({ status: "ok", version: "4.1.0" }),
      }) as Response) as typeof fetch;
    try {
      await expect(getMinerUHealth("http://mineru")).rejects.toThrow(
        "Unsupported MinerU version: 4.1.0",
      );
    } finally {
      global.fetch = originalFetch;
    }
  });
});
