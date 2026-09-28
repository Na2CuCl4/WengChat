import { jest } from "@jest/globals";

const originalFetch = global.fetch;

function response(enabled: boolean, status = 200): Response {
  return {
    ok: status === 200,
    status,
    json: async () => ({ enabled, error: "unavailable" }),
  } as Response;
}

async function loadApi(buildMode = "standalone") {
  jest.resetModules();
  jest.unstable_mockModule("@/app/store/access", () => ({
    useAccessStore: { getState: () => ({ accessCode: "" }) },
  }));
  document.head.innerHTML = `<meta name="config" content='{"buildMode":"${buildMode}"}'>`;
  return import("../app/mcp/api");
}

describe("MCP enabled query", () => {
  const fetchMock = jest.fn<() => Promise<Response>>();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test.each([true, false])(
    "caches %s after concurrent calls",
    async (enabled) => {
      let resolveResponse!: (value: Response) => void;
      fetchMock.mockImplementation(
        () => new Promise((resolve) => (resolveResponse = resolve)),
      );
      const { isMcpEnabled } = await loadApi();

      const first = isMcpEnabled();
      const second = isMcpEnabled();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      resolveResponse(response(enabled));

      expect(await Promise.all([first, second])).toEqual([enabled, enabled]);
      expect(await isMcpEnabled()).toBe(enabled);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    },
  );

  test.each(["HTTP", "network"])(
    "retries after %s failure",
    async (failure) => {
      if (failure === "HTTP")
        fetchMock.mockResolvedValueOnce(response(false, 503));
      else fetchMock.mockRejectedValueOnce(new Error("offline"));
      fetchMock.mockResolvedValueOnce(response(true));
      const { isMcpEnabled } = await loadApi();

      await expect(isMcpEnabled()).rejects.toThrow();
      await expect(isMcpEnabled()).resolves.toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    },
  );

  test("skips requests in export builds", async () => {
    const { isMcpEnabled } = await loadApi("export");
    expect(await isMcpEnabled()).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
