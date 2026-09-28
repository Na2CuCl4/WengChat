/** @jest-environment node */
import { handle } from "../app/api/proxy";

test.each([null, "ftp://example.com", "http://"])(
  "proxy rejects an invalid x-base-url (%s)",
  async (baseUrl) => {
    const headers = new Headers(baseUrl ? { "x-base-url": baseUrl } : {});
    const response = await handle(
      {
        method: "POST",
        headers,
        nextUrl: new URL("https://wengchat.example/api/cache/upload"),
      } as any,
      { params: { path: ["upload"] } },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid proxy base URL",
    });
  },
);
