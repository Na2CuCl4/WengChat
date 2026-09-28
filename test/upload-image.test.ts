import { jest } from "@jest/globals";
import { uploadImage } from "../app/utils/chat";

describe("uploadImage", () => {
  const originalImage = window.Image;
  const originalFetch = global.fetch;
  const serviceWorker = Object.getOwnPropertyDescriptor(
    navigator,
    "serviceWorker",
  );

  beforeEach(() => {
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { controller: null },
    });
    window.Image = class {
      onload?: () => void;
      width = 1;
      height = 1;
      set src(_value: string) {
        this.onload?.();
      }
    } as unknown as typeof Image;
    jest
      .spyOn(HTMLCanvasElement.prototype, "toDataURL")
      .mockReturnValue("data:image/jpeg;base64,dGVzdA==");
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });

  afterEach(() => {
    if (serviceWorker)
      Object.defineProperty(navigator, "serviceWorker", serviceWorker);
    else delete (navigator as any).serviceWorker;
    window.Image = originalImage;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test("falls back to an image data URL before the page is controlled", async () => {
    const request = jest.spyOn(global, "fetch");
    await expect(
      uploadImage(new Blob(["image"], { type: "image/png" })),
    ).resolves.toBe("data:image/jpeg;base64,dGVzdA==");
    expect(
      request.mock.calls.filter(([url]) => url === "/api/cache/upload"),
    ).toHaveLength(0);
  });

  test.each([
    ["HTTP failure", { ok: false, status: 400 }],
    [
      "invalid JSON",
      {
        ok: true,
        json: async () => {
          throw new SyntaxError("invalid JSON");
        },
      },
    ],
    [
      "non-string data",
      {
        ok: true,
        json: async () => ({ code: 0, data: { url: "/api/cache/image" } }),
      },
    ],
  ])(
    "falls back when the cache upload returns %s",
    async (_reason, response) => {
      Object.defineProperty(navigator, "serviceWorker", {
        configurable: true,
        value: { controller: {} },
      });
      global.fetch = jest.fn(async () => response) as any;
      await expect(
        uploadImage(new Blob(["image"], { type: "image/png" })),
      ).resolves.toBe("data:image/jpeg;base64,dGVzdA==");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/cache/upload",
        expect.objectContaining({ method: "post" }),
      );
    },
  );

  test("returns the cached URL when the page is controlled", async () => {
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { controller: {} },
    });
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ code: 0, data: "/api/cache/image.png" }),
    })) as any;
    await expect(
      uploadImage(new Blob(["image"], { type: "image/png" })),
    ).resolves.toBe("/api/cache/image.png");
    expect(HTMLCanvasElement.prototype.toDataURL).not.toHaveBeenCalled();
  });

  test("does not feed audio to the image compressor", async () => {
    const request = jest.spyOn(global, "fetch");
    await expect(
      uploadImage(new Blob(["audio"], { type: "audio/wav" })),
    ).rejects.toThrow("Service Worker image cache is unavailable");
    expect(
      request.mock.calls.filter(([url]) => url === "/api/cache/upload"),
    ).toHaveLength(0);
  });
});
