/** @jest-environment node */

import { jest } from "@jest/globals";

const originalEnv = process.env;
const code = "mcp-test-code";

function authorizedHeaders(value = code) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer nk-${value}`,
  };
}

async function loadRoute(enableMcp: string | undefined, accessCode?: string) {
  jest.resetModules();
  process.env.ENABLE_MCP = enableMcp;
  if (accessCode === undefined) delete process.env.CODE;
  else process.env.CODE = accessCode;
  return import("../app/api/mcp/route");
}

async function body(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe("MCP security boundary", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("enables MCP only for the exact value true", async () => {
    const { isMcpFeatureEnabled } = await import("../app/mcp/security");

    for (const value of [undefined, "false", "TRUE", "1", " true "]) {
      if (value === undefined) delete process.env.ENABLE_MCP;
      else process.env.ENABLE_MCP = value;
      expect(isMcpFeatureEnabled()).toBe(false);
    }

    process.env.ENABLE_MCP = "true";
    expect(isMcpFeatureEnabled()).toBe(true);
  });

  test("fails closed when disabled or when CODE is missing", async () => {
    let route = await loadRoute("false", code);
    let response = await route.GET(
      new Request("http://localhost/api/mcp?action=count", {
        headers: authorizedHeaders(),
      }),
    );
    expect(response.status).toBe(403);
    expect(await body(response)).toEqual({ error: "MCP is disabled" });

    route = await loadRoute("true");
    response = await route.GET(
      new Request("http://localhost/api/mcp?action=count", {
        headers: authorizedHeaders(),
      }),
    );
    expect(response.status).toBe(503);
    expect(await body(response)).toEqual({ error: "MCP is unavailable" });
  });

  test("accepts only the exact configured MCP bearer", async () => {
    const route = await loadRoute("true", code);

    for (const authorization of [
      undefined,
      "Bearer nk-wrong",
      "Bearer sk-user-model-api-key",
      `bearer nk-${code}`,
      `Bearer  nk-${code}`,
    ]) {
      const headers: Record<string, string> = {};
      if (authorization) headers.Authorization = authorization;
      const response = await route.GET(
        new Request("http://localhost/api/mcp?action=count", { headers }),
      );
      expect(response.status).toBe(401);
      expect(await body(response)).toEqual({ error: "Unauthorized" });
    }

    const response = await route.GET(
      new Request("http://localhost/api/mcp?action=count", {
        headers: authorizedHeaders(),
      }),
    );
    expect(response.status).toBe(200);
    expect(await body(response)).toEqual({ count: 0 });
  });

  test.each(["config", "command", "args", "env"])(
    "rejects an extra %s field before dispatch",
    async (field) => {
      const route = await loadRoute("true", code);
      const response = await route.POST(
        new Request("http://localhost/api/mcp", {
          method: "POST",
          headers: authorizedHeaders(),
          body: JSON.stringify({ action: "initialize", [field]: "untrusted" }),
        }),
      );

      expect(response.status).toBe(400);
      expect(await body(response)).toEqual({ error: "Invalid request" });
    },
  );

  test("returns sanitized success and failure envelopes", async () => {
    const route = await loadRoute("true", code);
    let response = await route.POST(
      new Request("http://localhost/api/mcp", {
        method: "POST",
        headers: authorizedHeaders(),
        body: JSON.stringify({ action: "restart" }),
      }),
    );
    expect(response.status).toBe(200);
    expect(await body(response)).toEqual({ ok: true });

    response = await route.POST(
      new Request("http://localhost/api/mcp", {
        method: "POST",
        headers: authorizedHeaders(),
        body: JSON.stringify({
          action: "execute",
          clientId: "missing-client",
          request: { method: "tools/call", params: { name: "missing-tool" } },
        }),
      }),
    );
    expect(response.status).toBe(500);
    expect(await body(response)).toEqual({ error: "MCP request failed" });
  });
});
